---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T04: Update coverage config and run full verification

Update vite.config.ts to include src/components/player/** in coverage (currently all components excluded). Run full test suite with coverage to verify green and report.

## Inputs

- `musicode-ui/vite.config.ts`

## Expected Output

- `coverage report showing player component files`

## Verification

cd musicode-ui && npx vitest run --coverage --reporter=verbose
