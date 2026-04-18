---
id: T02
parent: S03
milestone: M009
key_files:
  - musicode-ui/src/hooks/usePlayer.ts
  - musicode-ui/src/context/PlayerContext.tsx
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T09:48:00.536Z
blocker_discovered: false
---

# T02: Wired gapless pre-load and swap logic in usePlayer with timeupdate threshold and ended event handling

**Wired gapless pre-load and swap logic in usePlayer with timeupdate threshold and ended event handling**

## What Happened

Added gapless transition logic to usePlayer.ts: 1) On timeupdate, when remaining time ≤3s, calls audioGraph.prepareNext() with the next track URL based on queue/shuffle/repeat state. 2) On ended event, calls audioGraph.swap() then dispatches NEXT to update React state, with a flag indicating gapless swap so loadTrack skips redundant loading. 3) Edge cases handled: repeat-one restarts same track without swap, repeat-all wraps to queue[0] with gapless pre-load, repeat-off at queue end stops playback. 4) Manual skip (next/prev) cancels pending pre-load via audioGraph.cancelPreload() and loads target track directly. Uses preloadedRef and preloadingRef to avoid duplicate pre-loads.

## Verification

TypeScript compiles clean. Manual browser test: album plays with gapless transitions, skip works, all repeat modes correct, queue end stops.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/hooks/usePlayer.ts`
- `musicode-ui/src/context/PlayerContext.tsx`
