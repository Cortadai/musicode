---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: electron-builder configuration and test build

Finalize electron-builder config: NSIS installer, extraResources (JAR + JRE), app metadata, icon placeholder. Run npm run dist and verify output.

## Inputs

- `electron-builder docs for NSIS + extraResources`

## Expected Output

- `.exe installer in sonance-desktop/dist/`
- `Installer runs and launches app`

## Verification

npm run dist produces .exe in dist/ directory
