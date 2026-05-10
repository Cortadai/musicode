---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Verify frontend tsc + tests + build

Run tsc --noEmit, vitest --run, and npm run build in musicode-ui. Fix any remaining issues.

## Inputs

- `musicode-ui/`

## Expected Output

- `0 TS errors`
- `All tests pass`
- `Build successful`

## Verification

tsc --noEmit exits 0, vitest --run exits 0 with all tests passing, npm run build exits 0
