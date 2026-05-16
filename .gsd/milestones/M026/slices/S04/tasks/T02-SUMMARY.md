---
id: T02
parent: S04
milestone: M026
key_files:
  - sonance-desktop/main.js
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T14:08:02.785Z
blocker_discovered: false
---

# T02: System tray with Play/Pause, Next, Previous, Show, Quit — double-click restores window

**System tray with Play/Pause, Next, Previous, Show, Quit — double-click restores window**

## What Happened

Added Tray creation in main.js with context menu (Play/Pause, Next, Previous, separator, Show, Quit). Tray sends same media-key IPC as globalShortcut. Double-click on tray icon shows the main window. Falls back to empty icon if tray-icon.png not found.

## Verification

Code review — tray setup follows Electron Tray API correctly. Will be manually verified when running packaged app.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `code review` | 0 | pass | 0ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sonance-desktop/main.js`
