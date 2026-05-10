#Requires -Version 5.1
<#
Triggers a play event on the first available track and verifies scrobble
landed on both Last.fm and ListenBrainz.

Reads from env: LASTFM_USER, LB_TOKEN.
Reads Last.fm API key from .env file.
#>

$ErrorActionPreference = "Stop"

foreach ($var in @("LASTFM_USER", "LB_TOKEN")) {
    if (-not (Get-Item "Env:$var" -ErrorAction SilentlyContinue)) {
        Write-Error "Missing env var: $var"
        exit 1
    }
}

# Read LASTFM_API_KEY from .env
$envFile = Join-Path $PSScriptRoot "..\.env"
if (-not (Test-Path $envFile)) { Write-Error ".env not found at $envFile"; exit 1 }
$apiKey = (Get-Content $envFile | Where-Object { $_ -match "^LASTFM_API_KEY=" } | Select-Object -First 1) -replace "^LASTFM_API_KEY=", ""
if (-not $apiKey) { Write-Error "LASTFM_API_KEY not in .env"; exit 1 }

$BaseUrl = "http://localhost:17380"
$Session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# 1. Admin login
$loginBody = @{ username = "admin"; password = "changeme" } | ConvertTo-Json
$null = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -WebSession $Session
Write-Host "[1/6] Admin login OK"

# 2. Get first track
$tracks = Invoke-RestMethod -Uri "$BaseUrl/api/tracks?page=0&size=1" -Method Get -WebSession $Session
if ($tracks.content.Count -eq 0) { Write-Error "No tracks in library"; exit 1 }
$track = $tracks.content[0]
Write-Host "[2/6] First track: id=$($track.id) title='$($track.title)' artist='$($track.artist.name)'"

# 3. Resolve ListenBrainz username from token
try {
    $lbValidate = Invoke-RestMethod -Uri "https://api.listenbrainz.org/1/validate-token" -Method Get -Headers @{ "Authorization" = "Token $env:LB_TOKEN" }
    $lbUser = $lbValidate.user_name
    Write-Host "[3/6] ListenBrainz user: $lbUser (token valid=$($lbValidate.valid))"
} catch {
    Write-Error "ListenBrainz token validation failed: $($_.Exception.Message)"
    exit 1
}

# 4. POST play event
$playBody = @{ listenDurationSec = [int]([math]::Max(30, [double]$track.duration * 0.6)) } | ConvertTo-Json
$playResp = Invoke-RestMethod -Uri "$BaseUrl/api/plays/$($track.id)" -Method Post -Body $playBody -ContentType "application/json" -WebSession $Session
Write-Host "[4/6] Play recorded: id=$($playResp.id) at=$($playResp.playedAt)"

# 5. Wait for async scrobble (retries: 1s, 2s, 4s)
Write-Host "[5/6] Waiting for async scrobble..."
Start-Sleep -Seconds 6

# 6. Verify on Last.fm
$lfUrl = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=$env:LASTFM_USER&api_key=$apiKey&format=json&limit=3"
$lfResp = Invoke-RestMethod -Uri $lfUrl -Method Get
$lfRecent = $lfResp.recenttracks.track | Select-Object -First 3 | ForEach-Object {
    [PSCustomObject]@{
        Artist   = $_.artist.'#text'
        Title    = $_.name
        When     = if ($_.'@attr'.nowplaying) { "now playing" } elseif ($_.date) { $_.date.'#text' } else { "?" }
    }
}
Write-Host ""
Write-Host "=== Last.fm recent tracks (user=$env:LASTFM_USER) ==="
$lfRecent | Format-Table -AutoSize

# 7. Verify on ListenBrainz
$lbResp = Invoke-RestMethod -Uri "https://api.listenbrainz.org/1/user/$lbUser/listens?count=3" -Method Get
$lbRecent = $lbResp.payload.listens | Select-Object -First 3 | ForEach-Object {
    [PSCustomObject]@{
        Artist = $_.track_metadata.artist_name
        Title  = $_.track_metadata.track_name
        When   = [DateTimeOffset]::FromUnixTimeSeconds($_.listened_at).LocalDateTime
    }
}
Write-Host "=== ListenBrainz recent listens (user=$lbUser) ==="
$lbRecent | Format-Table -AutoSize

# 8. Match verification
$expectedTitle  = $track.title
$expectedArtist = $track.artist.name
$lfMatch = $lfRecent | Where-Object { $_.Title -eq $expectedTitle -and $_.Artist -eq $expectedArtist }
$lbMatch = $lbRecent | Where-Object { $_.Title -eq $expectedTitle -and $_.Artist -eq $expectedArtist }

Write-Host ""
Write-Host "=== Match against played track ==="
Write-Host "Expected: '$expectedArtist - $expectedTitle'"
Write-Host "Last.fm match:       $(if ($lfMatch) { 'YES' } else { 'NO' })"
Write-Host "ListenBrainz match:  $(if ($lbMatch) { 'YES (may take a minute to appear)' } else { 'NO (may take a minute to appear)' })"
