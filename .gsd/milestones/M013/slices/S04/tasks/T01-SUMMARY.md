---
id: T01
parent: S04
milestone: M013
key_files:
  - musicode-ui/src/hooks/useScrobble.ts
  - musicode-ui/src/hooks/usePlayer.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T19:39:48.981Z
blocker_discovered: false
---

# T01: useScrobble now returns { status: 'idle' | 'reported' | 'error' }, exposed via usePlayer

**useScrobble now returns { status: 'idle' | 'reported' | 'error' }, exposed via usePlayer**

## What Happened

Extended useScrobble hook to track scrobble lifecycle via useState: idle (pre-50%), reported (POST succeeded), error (POST failed). Resets to idle on track change. usePlayer destructures and re-exports scrobbleStatus.

## Verification

TypeScript clean, 117 tests pass

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | Clean | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/hooks/useScrobble.ts`
- `musicode-ui/src/hooks/usePlayer.ts`
