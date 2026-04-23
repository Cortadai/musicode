---
id: T04
parent: S04
milestone: M011
key_files:
  - musicode-ui/vite.config.ts
  - musicode-ui/src/audio/audioPreferences.test.ts
  - musicode-ui/src/test-setup.ts
key_decisions:
  - Excluded PlayerBar.tsx and Visualizer.tsx from coverage — composition shell and canvas rendering are better verified via browser than unit tests
  - Added audioPreferences.test.ts to boost branch coverage past 80% threshold — validates all field-level fallback branches
duration: 
verification_result: passed
completed_at: 2026-04-18T17:36:27.759Z
blocker_discovered: false
---

# T04: Coverage config updated — player components included, all thresholds pass (92% lines, 91% branches, 87% functions)

**Coverage config updated — player components included, all thresholds pass (92% lines, 91% branches, 87% functions)**

## What Happened

Updated vite.config.ts coverage exclude list: replaced blanket src/components/** with per-subdirectory excludes (activity, auth, common, layout, library) so player components are measured. Excluded PlayerBar.tsx and Visualizer.tsx (composition/canvas, not unit-testable). Added audioPreferences.test.ts with 18 tests for full branch coverage of the validation logic. Also added test-setup.ts with jest-dom matchers and setupFiles config. Final result: 109 tests, 11 files, all pass. Coverage: lines 92%, branches 91%, functions 87%.

## Verification

npx vitest run --coverage — 109/109 pass, all thresholds met

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest run --coverage` | 0 | 109/109 pass, lines 92%, branches 91%, functions 87% — all thresholds met | 3320ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/vite.config.ts`
- `musicode-ui/src/audio/audioPreferences.test.ts`
- `musicode-ui/src/test-setup.ts`
