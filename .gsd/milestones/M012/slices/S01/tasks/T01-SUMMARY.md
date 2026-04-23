---
id: T01
parent: S01
milestone: M012
key_files:
  - musicode-ui/src/hooks/useScrobble.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T18:27:35.096Z
blocker_discovered: false
---

# T01: Extracted play reporting logic into useScrobble hook

**Extracted play reporting logic into useScrobble hook**

## What Happened

Extracted the 50% threshold play reporting from usePlayer into a standalone useScrobble hook. The hook takes trackId, currentTime, and duration as params. It manages its own playReportedRef, abortControllerRef, and reset-on-track-change logic. Pure side-effect hook — no return value.

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

- `musicode-ui/src/hooks/useScrobble.ts`
