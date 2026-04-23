---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Extract useGapless hook

Extract gapless preload and crossfade triggering into useGapless.ts. Takes currentTime, duration, track, queue state, dispatch, and audioGraph refs. Manages preloadTriggeredRef, crossfadeTriggeredRef, and the onTimeUpdate preload/crossfade logic.

## Inputs

- `usePlayer.ts gapless/crossfade logic in onTimeUpdate callback`

## Expected Output

- `useGapless.ts with preload and crossfade triggering`
- `usePlayer.ts reduced to ~120 LOC orchestrator`

## Verification

vitest --run && manual check: tracks auto-advance with gapless, crossfade triggers when enabled
