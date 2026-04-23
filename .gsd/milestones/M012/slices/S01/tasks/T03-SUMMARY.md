---
id: T03
parent: S01
milestone: M012
key_files:
  - musicode-ui/src/hooks/useGapless.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T18:27:44.533Z
blocker_discovered: false
---

# T03: Extracted gapless preload and crossfade triggering into useGapless hook

**Extracted gapless preload and crossfade triggering into useGapless hook**

## What Happened

Extracted the most complex piece: audioGraph event wiring (onTimeUpdate, onLoadedMetadata, onEnded), preload threshold logic, crossfade triggering, and gapless swap. The hook owns the refs for queue/index/repeatMode/currentTrack to avoid stale closures in audioGraph callbacks. Returns setCrossfadeDuration and getCrossfadeDuration for the public API.

## Verification

vitest --run: 109 tests pass, tsc --noEmit: clean

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest --run` | 0 | pass | 3000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/hooks/useGapless.ts`
