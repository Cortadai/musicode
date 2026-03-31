---
estimated_steps: 6
estimated_files: 2
skills_used: []
---

# T02: Auth flow E2E tests

1. Write login.spec.ts:
   - Test valid login: fill username+password, submit, verify redirect to /
   - Test invalid credentials: fill wrong password, verify error message shown
   - Test logout: login, click logout, verify redirect to /login
2. Create test helpers: login function reusable across specs
3. Verify tests pass headless

## Inputs

- `Auth flow structure from AuthController and LoginPage`

## Expected Output

- `musicode-ui/e2e/login.spec.ts`
- `musicode-ui/e2e/helpers.ts`

## Verification

npx playwright test e2e/login.spec.ts passes headless.
