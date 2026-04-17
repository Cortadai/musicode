#Requires -Version 5.1
<#
Registers a music library folder and triggers a scan. Polls until scan completes.
Usage: .\register-and-scan.ps1 -Path "C:\path\to\music"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Path
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $Path -PathType Container)) {
    Write-Error "Path does not exist or is not a directory: $Path"
    exit 1
}

$BaseUrl = "http://localhost:8080"
$Session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Login admin
$loginBody = @{ username = "admin"; password = "changeme" } | ConvertTo-Json
$null = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -WebSession $Session
Write-Host "[1/4] Admin login OK"

# Register folder (tolerate already-registered conflict)
$folderBody = @{ path = $Path } | ConvertTo-Json
try {
    $folder = Invoke-RestMethod -Uri "$BaseUrl/api/library/folders" -Method Post -Body $folderBody -ContentType "application/json" -WebSession $Session
    Write-Host "[2/4] Folder registered: id=$($folder.id) path=$($folder.path)"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 409) {
        Write-Host "[2/4] Folder already registered, continuing"
    } else {
        Write-Error "POST /api/library/folders failed: $($_.Exception.Message)"
        if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message }
        exit 1
    }
}

# Trigger scan
try {
    $scan = Invoke-RestMethod -Uri "$BaseUrl/api/library/scan" -Method Post -WebSession $Session
    Write-Host "[3/4] Scan started: $($scan.message)"
} catch {
    Write-Error "POST /api/library/scan failed: $($_.Exception.Message)"
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message }
    exit 1
}

# Poll until idle
Write-Host "[4/4] Polling scan status..."
$deadline = (Get-Date).AddMinutes(5)
do {
    Start-Sleep -Seconds 2
    $status = Invoke-RestMethod -Uri "$BaseUrl/api/library/scan/status" -Method Get -WebSession $Session
    Write-Host ("  state={0} processed={1}/{2} new={3} updated={4} errors={5}" -f `
        $status.state, $status.processedFiles, $status.totalFiles, $status.newTracks, $status.updatedTracks, $status.errorFiles)
    if ((Get-Date) -gt $deadline) {
        Write-Error "Scan did not complete within 5 minutes"
        exit 1
    }
} while ($status.state -eq "SCANNING")

Write-Host "`nScan done. Final status:"
$status | ConvertTo-Json
