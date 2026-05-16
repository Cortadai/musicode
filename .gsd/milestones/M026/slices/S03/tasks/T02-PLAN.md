---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: JRE bundling strategy

Document and script the JRE download for bundling. Use jlink or adoptium to get a minimal JRE. Add a script to fetch it into sonance-desktop/jre/. Update electron-builder extraResources.

## Inputs

- `Java version required (17+)`
- `Adoptium API for JRE downloads`

## Expected Output

- `jre/ directory with minimal runtime`
- `Script to reproduce the download`

## Verification

Script downloads JRE, electron-builder config references it correctly
