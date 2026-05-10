---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Verify backend mvn verify

Run mvn -B verify in musicode-server and confirm all tests pass and build succeeds.

## Inputs

- `musicode-server/`

## Expected Output

- `BUILD SUCCESS`
- `All tests pass`

## Verification

mvn -B verify exits 0 with all tests passing
