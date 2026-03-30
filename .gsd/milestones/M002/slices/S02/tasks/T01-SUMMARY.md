---
id: T01
parent: S02
milestone: M002
provides: []
requires: []
affects: []
key_files: ["musicode-ui/src/context/PlayerContext.tsx", "musicode-ui/src/hooks/usePlayer.ts", "musicode-ui/src/components/player/PlayerBar.tsx", "musicode-ui/src/components/layout/AppShell.tsx"]
key_decisions: ["Shuffle uses Fisher-Yates on queue, keeps current track at position 0", "Repeat cycles: off → all → one via TOGGLE_REPEAT", "Repeat-one restarts track on NEXT, repeat-all loops queue", "Keyboard shortcuts ignore input/textarea/select focus", "Cover art in player bar is a Link to /albums/{id} with hover ring"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Player bar renders shuffle/repeat buttons. Cover art is a link. Keyboard shortcuts wired. All verified visually in browser screenshot showing new controls layout."
completed_at: 2026-03-30T10:55:00.608Z
blocker_discovered: false
---

# T01: Shuffle, repeat (off/all/one), keyboard shortcuts (Space/arrows/M), and cover art click navigates to album.

> Shuffle, repeat (off/all/one), keyboard shortcuts (Space/arrows/M), and cover art click navigates to album.

## What Happened
---
id: T01
parent: S02
milestone: M002
key_files:
  - musicode-ui/src/context/PlayerContext.tsx
  - musicode-ui/src/hooks/usePlayer.ts
  - musicode-ui/src/components/player/PlayerBar.tsx
  - musicode-ui/src/components/layout/AppShell.tsx
key_decisions:
  - Shuffle uses Fisher-Yates on queue, keeps current track at position 0
  - Repeat cycles: off → all → one via TOGGLE_REPEAT
  - Repeat-one restarts track on NEXT, repeat-all loops queue
  - Keyboard shortcuts ignore input/textarea/select focus
  - Cover art in player bar is a Link to /albums/{id} with hover ring
duration: ""
verification_result: passed
completed_at: 2026-03-30T10:55:00.608Z
blocker_discovered: false
---

# T01: Shuffle, repeat (off/all/one), keyboard shortcuts (Space/arrows/M), and cover art click navigates to album.

**Shuffle, repeat (off/all/one), keyboard shortcuts (Space/arrows/M), and cover art click navigates to album.**

## What Happened

Added shuffle and repeat to PlayerContext with TOGGLE_SHUFFLE (Fisher-Yates, preserves current track) and TOGGLE_REPEAT (cycles off/all/one). NEXT respects repeat-one (restart) and repeat-all (loop). PREV with repeat-all loops to end. Added toggleShuffle and toggleRepeat to usePlayer hook. Updated PlayerBar with shuffle/repeat buttons (indigo when active, Repeat1 icon for repeat-one). Cover art in player bar wrapped in Link to /albums/{id} with hover ring indicator. Added global keyboard shortcuts in AppShell: Space (play/pause), ArrowRight (next), ArrowLeft (prev), M (mute toggle). Shortcuts disabled when focus is in input/textarea.

## Verification

Player bar renders shuffle/repeat buttons. Cover art is a link. Keyboard shortcuts wired. All verified visually in browser screenshot showing new controls layout.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `browser_screenshot player bar` | 0 | ✅ pass — shuffle + prev + pause + next + repeat buttons visible | 500ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/context/PlayerContext.tsx`
- `musicode-ui/src/hooks/usePlayer.ts`
- `musicode-ui/src/components/player/PlayerBar.tsx`
- `musicode-ui/src/components/layout/AppShell.tsx`


## Deviations
None.

## Known Issues
None.
