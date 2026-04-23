---
id: S03
parent: M012
milestone: M012
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - [".github/workflows/ci.yml"]
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
completed_at: 2026-04-18T18:31:46.435Z
blocker_discovered: false
---

# S03: GitHub Actions CI workflow

**CI workflow with parallel backend (mvn verify) and frontend (tsc + vitest + build) jobs on push and PR**

## What Happened

Created .github/workflows/ci.yml. Two parallel jobs: backend runs mvn -B verify with Java 21 and Maven cache; frontend runs npm ci + tsc --noEmit + vitest --run + npm run build with Node 20 and npm cache. Triggers on push to main and PRs targeting main. Working-directory defaults keep steps clean. YAML validated.

## Verification

YAML lint passed. Workflow syntax follows GitHub Actions conventions. Will be fully validated on first push to GitHub.

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
