---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: Pre-load and swap logic in usePlayer

Wire gapless transitions in usePlayer.ts: 1) On timeupdate, when remaining time ≤3s, call audioGraph.prepareNext() with the next track URL (respecting queue, shuffle, repeat). 2) On ended event, call audioGraph.swap() then dispatch NEXT to update React state. 3) Handle edge cases: queue end (no next track), repeat-one (restart same track, no swap), repeat-all (wrap to queue[0]). 4) Manual skip (next/prev) must cancel any pending pre-load and load the target track directly.

## Inputs

- `audioGraph dual-element API from T01`
- `PlayerContext reducer (NEXT/PREV logic)`
- `Queue/shuffle/repeat state`

## Expected Output

- `usePlayer.ts with pre-load timing, swap-on-ended, skip cancellation`

## Verification

TypeScript compiles clean. Manual: play album, verify gapless transition between tracks. Test skip, repeat modes, queue end.
