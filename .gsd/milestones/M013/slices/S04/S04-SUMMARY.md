---
id: S04
parent: M013
milestone: M013
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/components/player/ScrobbleIndicator.tsx", "musicode-ui/src/hooks/useScrobble.ts", "musicode-ui/src/hooks/usePlayer.ts", "musicode-ui/src/components/player/PlayerBar.tsx"]
key_decisions:
  - (none)
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-18T19:40:18.227Z
blocker_discovered: false
---

# S04: Scrobble status indicator

**Visual scrobble status indicator in PlayerBar — Radio icon shows idle/reported/error with accent color and tooltip**

## What Happened

Extended useScrobble to return a status state (idle → reported → error) tracked through the play recording lifecycle. Created ScrobbleIndicator component that queries scrobble settings on mount — only renders when Last.fm or ListenBrainz is configured. Radio icon shows in zinc-600 (waiting), indigo-400 (play reported), or amber-500 (failed) with descriptive tooltip. Placed in PlayerBar right controls area. Status resets to idle on track change.

## Verification

TypeScript clean, 117 tests pass, build succeeds

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
