---
estimated_steps: 7
estimated_files: 1
skills_used: []
---

# T04: Admin user management E2E tests + stability

1. Write admin.spec.ts:
   - Test create user: login as admin, navigate to /users, create new user
   - Verify user appears in list
   - Test delete user: delete the created user, verify removed from list
   - Test cannot delete self: verify error when trying to delete admin
2. Run full test suite 5 consecutive times to verify stability
3. Verify no regressions: npm run test:coverage, mvn clean verify

## Inputs

- `UsersPage component, UserController`

## Expected Output

- `musicode-ui/e2e/admin.spec.ts`

## Verification

npx playwright test passes headless. Run 5 times with 0 failures. npm run test:coverage passes.
