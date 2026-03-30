---
id: T02
parent: S04
milestone: M001
provides: []
requires: []
affects: []
key_files: ["musicode-ui/src/components/player/PlayerBar.tsx", "musicode-ui/src/components/layout/AppShell.tsx"]
key_decisions: ["Player bar height 80px fixed to bottom of AppShell", "Progress bar click-to-seek with hover dot indicator", "Volume click-to-set with mute toggle"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Player bar appears when track clicked, shows cover art, title, controls. Seek works by clicking progress bar. Volume slider works."
completed_at: 2026-03-30T09:33:59.501Z
blocker_discovered: false
---

# T02: Persistent player bar with play/pause, seek, next/prev, volume — fixed at bottom of UI.

> Persistent player bar with play/pause, seek, next/prev, volume — fixed at bottom of UI.

## What Happened
---
id: T02
parent: S04
milestone: M001
key_files:
  - musicode-ui/src/components/player/PlayerBar.tsx
  - musicode-ui/src/components/layout/AppShell.tsx
key_decisions:
  - Player bar height 80px fixed to bottom of AppShell
  - Progress bar click-to-seek with hover dot indicator
  - Volume click-to-set with mute toggle
duration: ""
verification_result: passed
completed_at: 2026-03-30T09:33:59.501Z
blocker_discovered: false
---

# T02: Persistent player bar with play/pause, seek, next/prev, volume — fixed at bottom of UI.

**Persistent player bar with play/pause, seek, next/prev, volume — fixed at bottom of UI.**

## What Happened

Created PlayerBar with: cover art thumbnail, track title + artist, play/pause/prev/next buttons, progress bar with click-to-seek and time display, volume slider with mute toggle. Fixed to bottom of AppShell. Only appears when a track is playing. All controls wired to usePlayer actions.

## Verification

Player bar appears when track clicked, shows cover art, title, controls. Seek works by clicking progress bar. Volume slider works.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `browser_screenshot player bar` | 0 | ✅ pass — player bar with all controls visible | 500ms |
| 2 | `click progress bar to seek` | 0 | ✅ pass — seek jumped to 0:53 | 500ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/player/PlayerBar.tsx`
- `musicode-ui/src/components/layout/AppShell.tsx`


## Deviations
None.

## Known Issues
None.
