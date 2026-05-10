# Sonance stopper — delegates to .bat
param()

& (Join-Path $PSScriptRoot "stop-sonance.bat")
