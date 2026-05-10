# Download Adoptium JRE 21 for Windows x64 into sonance-desktop/jre/
# Uses Eclipse Temurin (Adoptium) API

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DesktopDir = Split-Path -Parent $ScriptDir
$JreDir = Join-Path $DesktopDir "jre"

$JavaVersion = "21"
$OS = "windows"
$Arch = "x64"
$ImageType = "jre"

$ApiUrl = "https://api.adoptium.net/v3/binary/latest/$JavaVersion/ga/$OS/$Arch/$ImageType/hotspot/normal/eclipse?project=jdk"

Write-Host "=== Downloading Adoptium JRE $JavaVersion ($OS/$Arch) ==="

$TempZip = Join-Path $env:TEMP "adoptium-jre.zip"

Invoke-WebRequest -Uri $ApiUrl -OutFile $TempZip -UseBasicParsing

Write-Host "=== Extracting to $JreDir ==="

if (Test-Path $JreDir) {
    Remove-Item -Recurse -Force $JreDir
}

Expand-Archive -Path $TempZip -DestinationPath $env:TEMP\adoptium-jre-extract -Force

# Adoptium zips have a top-level directory like jdk-21.0.3+9-jre
$ExtractedDir = Get-ChildItem "$env:TEMP\adoptium-jre-extract" | Select-Object -First 1

Move-Item -Path $ExtractedDir.FullName -Destination $JreDir

# Cleanup
Remove-Item -Force $TempZip
Remove-Item -Recurse -Force "$env:TEMP\adoptium-jre-extract"

Write-Host "=== JRE installed at $JreDir ==="
Write-Host "Java version:"
& "$JreDir\bin\java.exe" -version
