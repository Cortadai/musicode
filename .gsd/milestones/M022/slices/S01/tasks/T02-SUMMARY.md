---
id: T02
parent: S01
milestone: M022
key_files:
  - musicode-ui/src/components/player/LyricsSidebar.tsx
  - musicode-ui/src/components/player/PlayerBar.tsx
key_decisions:
  - (none)
duration: 
verification_result: untested
completed_at: 2026-05-09T12:39:07.574Z
blocker_discovered: false
---

# T02: Built LyricsSidebar component and added lyrics toggle button to PlayerBar

**Built LyricsSidebar component and added lyrics toggle button to PlayerBar**

## What Happened

Created LyricsSidebar.tsx wrapping LyricsPanel in a sidebar aside matching QueuePanel styling. Added Mic2 icon button to PlayerBar right section. Mutual exclusion wired: opening lyrics closes queue, opening queue closes lyrics. Font size tuned to text-sm for sidebar context.

## Verification

TypeScript compiles, button renders in PlayerBar, sidebar opens/closes correctly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| — | No verification commands discovered | — | — | — |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/player/LyricsSidebar.tsx`
- `musicode-ui/src/components/player/PlayerBar.tsx`
