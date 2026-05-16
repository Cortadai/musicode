---
id: T01
parent: S01
milestone: M026
key_files:
  - sonance-desktop/package.json
  - sonance-desktop/main.js
  - sonance-desktop/preload.js
  - sonance-desktop/.gitignore
key_decisions:
  - Used plain electron + concurrently instead of electron-vite (simpler for sidecar use case)
  - electron-builder extraResources pattern for JAR + JRE bundling
  - preload exposes electronAPI.onMediaKey for future S04 media keys
duration: 
verification_result: passed
completed_at: 2026-05-10T13:47:14.277Z
blocker_discovered: false
---

# T01: Electron scaffold with BrowserWindow (minWidth:900, minHeight:600), preload, and package.json

**Electron scaffold with BrowserWindow (minWidth:900, minHeight:600), preload, and package.json**

## What Happened

Created sonance-desktop/ directory with main.js (BrowserWindow loading localhost:5173 in dev, file:// in prod), preload.js (contextBridge with electronAPI stub for media keys), package.json (electron 33, electron-builder 25, concurrently, wait-on), and .gitignore. electron-builder config includes extraResources for JAR and JRE bundling.

## Verification

Ran `npx electron .` — window opened, attempted localhost:5173 load (ERR_CONNECTION_REFUSED confirms correct URL targeting). Then started vite separately, re-ran electron — loaded successfully with no connection errors.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx electron . (with vite running)` | 0 | pass | 6000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sonance-desktop/package.json`
- `sonance-desktop/main.js`
- `sonance-desktop/preload.js`
- `sonance-desktop/.gitignore`
