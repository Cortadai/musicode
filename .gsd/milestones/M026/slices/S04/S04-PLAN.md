# S04: Polish — media keys, tray, docs

**Goal:** Add desktop integration (media keys, system tray) and update documentation for the new Electron architecture
**Demo:** Media keys control playback, tray icon shows with context menu, README documents setup

## Must-Haves

- Media keys control playback, system tray icon with context menu (play/pause, quit), README documents setup and build

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Global media key support** `est:20min`
  Register globalShortcut or use Electron's built-in MediaSession for media keys (play/pause, next, previous). Send IPC to renderer which dispatches to the audio player.
  - Files: `sonance-desktop/main.js`, `sonance-desktop/preload.js`, `sonance-ui/src/hooks/useElectronMediaKeys.ts`
  - Verify: Press media keys on keyboard — playback responds

- [x] **T02: System tray with context menu** `est:15min`
  Create a Tray with icon and context menu: Play/Pause, Next, Previous, separator, Quit. Minimize to tray on window close (optional). Show window on tray double-click.
  - Files: `sonance-desktop/main.js`
  - Verify: Tray icon visible with working context menu

- [x] **T03: Update README with Electron architecture** `est:10min`
  Update the project README to document: new architecture (Electron + Spring Boot sidecar), dev setup, build commands, and how to run the packaged app.
  - Files: `README.md`
  - Verify: README accurately describes current architecture

## Files Likely Touched

- sonance-desktop/main.js
- sonance-desktop/preload.js
- sonance-ui/src/hooks/useElectronMediaKeys.ts
- README.md
