---
id: T01
parent: S04
milestone: M026
key_files:
  - sonance-desktop/main.js
  - sonance-desktop/preload.js
  - sonance-ui/src/hooks/useElectronMediaKeys.ts
  - sonance-ui/src/components/layout/AppShell.tsx
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T14:07:56.532Z
blocker_discovered: false
---

# T01: Global media keys (play/pause, next, prev, stop) via globalShortcut + IPC to renderer

**Global media keys (play/pause, next, prev, stop) via globalShortcut + IPC to renderer**

## What Happened

Registered MediaPlayPause, MediaNextTrack, MediaPreviousTrack, MediaStop via Electron globalShortcut. Main process sends IPC 'media-key' to renderer. Preload exposes window.electronAPI.onMediaKey. Created useElectronMediaKeys hook that listens and dispatches to player context (pause/resume/next/prev/stop). Wired into AppShell component.

## Verification

TypeScript compiles, 234 frontend tests pass. Hook safely no-ops when window.electronAPI is undefined (browser mode).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 5000ms |
| 2 | `npx vitest run` | 0 | pass | 6000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sonance-desktop/main.js`
- `sonance-desktop/preload.js`
- `sonance-ui/src/hooks/useElectronMediaKeys.ts`
- `sonance-ui/src/components/layout/AppShell.tsx`
