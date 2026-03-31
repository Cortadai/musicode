---
id: T02
parent: S03
milestone: M004
provides: []
requires: []
affects: []
key_files: ["musicode-ui/src/context/AuthContext.tsx", "musicode-ui/src/api/client.ts", "musicode-ui/src/hooks/usePlayer.ts", "musicode-ui/src/context/PlayerContext.tsx", "musicode-ui/src/utils/errors.test.ts"]
key_decisions: ["console.debug with [auth], [axios], [player] prefixes for grep-ability", "Didactic comments explain WHY, not WHAT — architecture decisions, trade-offs, and non-obvious patterns"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build + npm run test:coverage — 40 tests pass, all thresholds met."
completed_at: 2026-03-31T10:24:05.678Z
blocker_discovered: false
---

# T02: console.debug in auth/player/axios + didactic comments + errors.test.ts — 40 tests green, coverage met.

> console.debug in auth/player/axios + didactic comments + errors.test.ts — 40 tests green, coverage met.

## What Happened
---
id: T02
parent: S03
milestone: M004
key_files:
  - musicode-ui/src/context/AuthContext.tsx
  - musicode-ui/src/api/client.ts
  - musicode-ui/src/hooks/usePlayer.ts
  - musicode-ui/src/context/PlayerContext.tsx
  - musicode-ui/src/utils/errors.test.ts
key_decisions:
  - console.debug with [auth], [axios], [player] prefixes for grep-ability
  - Didactic comments explain WHY, not WHAT — architecture decisions, trade-offs, and non-obvious patterns
duration: ""
verification_result: passed
completed_at: 2026-03-31T10:24:05.678Z
blocker_discovered: false
---

# T02: console.debug in auth/player/axios + didactic comments + errors.test.ts — 40 tests green, coverage met.

**console.debug in auth/player/axios + didactic comments + errors.test.ts — 40 tests green, coverage met.**

## What Happened

Added console.debug with prefixed tags: [auth] for session restore/login/logout, [axios] for refresh attempts and queue state, [player] for track loading and playback errors. Added comprehensive didactic comments: PlayerContext (why useReducer, why two contexts, why originalQueue), usePlayer (why singleton Audio, why Symbol owner pattern, why module-level), AuthContext (why getMe on mount, why ignore logout errors, why Context not Redux), axios interceptor (why queue, what happens without it). Added errors.test.ts with 5 tests for getErrorMessage. Total: 40 frontend tests, all green, coverage well above thresholds.

## Verification

npm run build + npm run test:coverage — 40 tests pass, all thresholds met.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 4800ms |
| 2 | `npm run test:coverage` | 0 | ✅ pass — 40 tests, 91.54% lines | 4600ms |


## Deviations

Added errors.test.ts (5 tests) to cover getErrorMessage utility — not originally planned but ensures coverage thresholds stay healthy.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/context/AuthContext.tsx`
- `musicode-ui/src/api/client.ts`
- `musicode-ui/src/hooks/usePlayer.ts`
- `musicode-ui/src/context/PlayerContext.tsx`
- `musicode-ui/src/utils/errors.test.ts`


## Deviations
Added errors.test.ts (5 tests) to cover getErrorMessage utility — not originally planned but ensures coverage thresholds stay healthy.

## Known Issues
None.
