# S01: Extract usePlayer into composable hooks

**Goal:** Extract usePlayer.ts (418 LOC) into 3 focused hooks + thin orchestrator. useScrobble handles play reporting, useMediaSession handles OS integration, useGapless handles preload/crossfade triggering. usePlayer drops to ~120 LOC of pure orchestration. All 5 consumers unchanged — same public API.
**Demo:** Player works identically — play, pause, next, prev, seek, shuffle, scrobble at 50%, media session controls on lock screen. usePlayer.ts is ~120 LOC orchestrator.

## Must-Haves

- 1. usePlayer.ts ≤150 LOC orchestrator
- 2. useScrobble, useMediaSession, useGapless exist as separate files
- 3. All existing frontend tests pass (vitest --run)
- 4. Player functionality identical: play, pause, next, prev, seek, shuffle, repeat, scrobble at 50%, media session controls, gapless preload, crossfade
- 5. No changes to usePlayer public API — consumers untouched

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Extract useScrobble hook** `est:20min`
  Extract play reporting logic (50% threshold, abort controller, recordPlay call) into useScrobble.ts. Takes trackId, currentTime, duration as inputs. Returns nothing — pure side-effect hook.
  - Files: `musicode-ui/src/hooks/useScrobble.ts`, `musicode-ui/src/hooks/usePlayer.ts`
  - Verify: vitest --run && manual check: play a track past 50%, verify POST /api/plays fires once

- [x] **T02: Extract useMediaSession hook** `est:20min`
  Extract Media Session API logic (metadata sync, action handlers, position state) into useMediaSession.ts. Takes track, isPlaying, duration, currentTime, and callbacks (onPlay, onPause, onNext, onPrev, onSeek).
  - Files: `musicode-ui/src/hooks/useMediaSession.ts`, `musicode-ui/src/hooks/usePlayer.ts`
  - Verify: vitest --run && manual check: media session metadata updates on track change, OS controls work

- [x] **T03: Extract useGapless hook** `est:25min`
  Extract gapless preload and crossfade triggering into useGapless.ts. Takes currentTime, duration, track, queue state, dispatch, and audioGraph refs. Manages preloadTriggeredRef, crossfadeTriggeredRef, and the onTimeUpdate preload/crossfade logic.
  - Files: `musicode-ui/src/hooks/useGapless.ts`, `musicode-ui/src/hooks/usePlayer.ts`
  - Verify: vitest --run && manual check: tracks auto-advance with gapless, crossfade triggers when enabled

- [x] **T04: Final verification and cleanup** `est:10min`
  Run full test suite, verify usePlayer.ts is ≤150 LOC, verify all consumers still work without changes. Clean up any dead imports or unused refs.
  - Files: `musicode-ui/src/hooks/usePlayer.ts`
  - Verify: vitest --run && wc -l usePlayer.ts ≤150 && no import changes in consumers

## Files Likely Touched

- musicode-ui/src/hooks/useScrobble.ts
- musicode-ui/src/hooks/usePlayer.ts
- musicode-ui/src/hooks/useMediaSession.ts
- musicode-ui/src/hooks/useGapless.ts
