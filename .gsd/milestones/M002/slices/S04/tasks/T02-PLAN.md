---
estimated_steps: 9
estimated_files: 2
skills_used: []
---

# T02: Vitest coverage enforcement in frontend

Why: Need automated coverage enforcement at 80% threshold for frontend.

Files: `musicode-ui/vite.config.ts`, `musicode-ui/package.json`

Do:
1. Install `@vitest/coverage-v8`.
2. Add coverage config to vite.config.ts test section: provider 'v8', thresholds for lines/functions/branches at 80%.
3. Add `test:coverage` script to package.json.
4. Run `npm run test:coverage` and check report. If coverage is below 80%, add tests for uncovered code until threshold is met.

Verify: `cd musicode-ui && npm run test:coverage`
Done when: Vitest coverage check passes with ≥80% line coverage.

## Inputs

- `musicode-ui/vite.config.ts`
- `musicode-ui/package.json`
- `All existing test files`

## Expected Output

- `musicode-ui/coverage/`

## Verification

cd musicode-ui && npm run test:coverage
