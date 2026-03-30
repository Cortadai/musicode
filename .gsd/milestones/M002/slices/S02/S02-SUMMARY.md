---
id: S02
parent: M002
milestone: M002
provides:
  - Shuffle/repeat in player
  - Keyboard shortcuts
  - Cover art → album navigation
requires:
  - slice: S04
    provides: PlayerContext and PlayerBar from M001/S04
affects:
  - S03
key_files:
  - musicode-ui/src/context/PlayerContext.tsx
  - musicode-ui/src/components/player/PlayerBar.tsx
  - musicode-ui/src/components/layout/AppShell.tsx
key_decisions:
  - Fisher-Yates shuffle preserving current track
  - Repeat cycles off→all→one
  - Keyboard shortcuts skip input focus
patterns_established:
  - Global keyboard shortcuts in AppShell with input focus guard
  - originalQueue preserved for unshuffle
observability_surfaces:
  - Shuffle/repeat state visible as button color in player bar
drill_down_paths:
  - .gsd/milestones/M002/slices/S02/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-30T10:55:25.284Z
blocker_discovered: false
---

# S02: Player Polish — Shuffle, Repeat, Keyboard, Navigation

**Shuffle, repeat, keyboard shortcuts, and cover art album navigation.**

## What Happened

Added shuffle (Fisher-Yates), repeat (off/all/one), keyboard shortcuts (Space/arrows/M), and cover art navigation to album page. All controls visible in player bar with indigo active state.

## Verification

Player bar screenshot confirms shuffle + repeat buttons rendered. Keyboard shortcuts wired in AppShell. Cover art wrapped in Link.

## Requirements Advanced

- R004 — Full playback controls: shuffle, repeat, keyboard, album navigation

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `musicode-ui/src/context/PlayerContext.tsx` — Added shuffle, repeatMode, originalQueue to state. Added TOGGLE_SHUFFLE and TOGGLE_REPEAT actions. NEXT/PREV respect repeat modes.
- `musicode-ui/src/hooks/usePlayer.ts` — Added toggleShuffle, toggleRepeat. Repeat-one restarts on ended.
- `musicode-ui/src/components/player/PlayerBar.tsx` — Shuffle + repeat buttons with active styling. Cover art as Link to album. Repeat1 icon for one mode.
- `musicode-ui/src/components/layout/AppShell.tsx` — Global keyboard shortcuts: Space, ArrowLeft, ArrowRight, M.
