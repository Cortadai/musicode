---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: Verify build and tests

Run TypeScript check and all tests.

## Inputs

- None specified.

## Expected Output

- `Clean build, all tests pass`

## Verification

tsc --noEmit clean, vitest --run all green
