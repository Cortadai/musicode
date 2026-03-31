---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T04: Frontend auth tests

Write tests for auth interceptor refresh queue logic (unit test the queue mechanism). Write tests for AuthContext state transitions: initial loading state, login sets user, logout clears user, isAdmin computed correctly. Verify all existing tests (PlayerContext, format utils) still pass. npm run test:coverage passes.

## Inputs

- `AuthContext from T02`
- `api/auth.ts from T01`

## Expected Output

- `context/AuthContext.test.ts or similar`
- `All tests pass`

## Verification

npm run test:coverage — all tests pass, coverage thresholds met
