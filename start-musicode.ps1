# Musicode launcher — delegates to .bat with fnm-aware PATH
param()

$fnmBase = Join-Path $env:USERPROFILE "scoop\persist\fnm\node-versions"
if (Test-Path $fnmBase) {
    $nodeDir = Get-ChildItem -Directory $fnmBase |
        Where-Object { $_.Name -match '^v\d' } |
        Sort-Object Name -Descending |
        Select-Object -First 1
    if ($nodeDir) {
        $nodeBin = Join-Path $nodeDir.FullName "installation"
        if (Test-Path (Join-Path $nodeBin "node.exe")) {
            $env:PATH = "$nodeBin;$env:PATH"
        }
    }
}

& (Join-Path $PSScriptRoot "start-musicode.bat")
