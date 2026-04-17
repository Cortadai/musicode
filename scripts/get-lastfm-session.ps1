# Generates a Last.fm session key via auth.getMobileSession.
# Reads LASTFM_USER / LASTFM_PASS from env. Never prints the password.
# Prints the session key to stdout — safe to share (not a password).

$ErrorActionPreference = 'Stop'

$apiKey    = 'f11dc344e10d8d14e08194db70d46fed'
$apiSecret = 'dfafd5f58f293cffc23c0b1363ce485d'

if (-not $env:LASTFM_USER -or -not $env:LASTFM_PASS) {
    Write-Error 'Set $env:LASTFM_USER and $env:LASTFM_PASS first.'
    exit 1
}

$params = [ordered]@{
    api_key  = $apiKey
    method   = 'auth.getMobileSession'
    password = $env:LASTFM_PASS
    username = $env:LASTFM_USER
}

# Signature: concat k+v alphabetically, append secret, md5 lowercase hex.
$sorted = $params.Keys | Sort-Object
$sigInput = -join ($sorted | ForEach-Object { "$_$($params[$_])" }) + $apiSecret
$md5 = [System.Security.Cryptography.MD5]::Create()
$bytes = [System.Text.Encoding]::UTF8.GetBytes($sigInput)
$hash  = $md5.ComputeHash($bytes)
$apiSig = -join ($hash | ForEach-Object { $_.ToString('x2') })

$body = @{
    api_key  = $apiKey
    method   = 'auth.getMobileSession'
    password = $env:LASTFM_PASS
    username = $env:LASTFM_USER
    api_sig  = $apiSig
    format   = 'json'
}

$resp = Invoke-RestMethod -Method Post `
    -Uri 'https://ws.audioscrobbler.com/2.0/' `
    -Body $body `
    -ContentType 'application/x-www-form-urlencoded'

if ($resp.error) {
    Write-Error "Last.fm error $($resp.error): $($resp.message)"
    exit 1
}

Write-Host "Session key for user '$($resp.session.name)':" -ForegroundColor Green
Write-Host $resp.session.key
