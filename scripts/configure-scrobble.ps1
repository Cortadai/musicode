#Requires -Version 5.1
<#
Configures admin's Last.fm + ListenBrainz credentials on the running server.
Reads from env: LASTFM_USER, LASTFM_PASS, LB_TOKEN.
#>

$ErrorActionPreference = "Stop"

foreach ($var in @("LASTFM_USER", "LASTFM_PASS", "LB_TOKEN")) {
    if (-not (Get-Item "Env:$var" -ErrorAction SilentlyContinue)) {
        Write-Error "Missing env var: $var"
        exit 1
    }
}

$BaseUrl = "http://localhost:17380"
$Session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Login admin
$loginBody = @{ username = "admin"; password = "changeme" } | ConvertTo-Json
$null = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -WebSession $Session
Write-Host "[1/2] Admin login OK"

# PUT scrobble settings
$settingsBody = @{
    lastfmUsername     = $env:LASTFM_USER
    lastfmPassword     = $env:LASTFM_PASS
    listenbrainzToken  = $env:LB_TOKEN
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "$BaseUrl/api/scrobble/settings" -Method Put -Body $settingsBody -ContentType "application/json" -WebSession $Session
    Write-Host "[2/2] Scrobble settings updated:"
    $resp | ConvertTo-Json
} catch {
    Write-Error "PUT /api/scrobble/settings failed: $($_.Exception.Message)"
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message }
    exit 1
}
