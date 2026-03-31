---
estimated_steps: 8
estimated_files: 2
skills_used: []
---

# T02: Navigation + error state E2E tests

1. Write navigation.spec.ts:
   - Test tracks page: login, navigate to /tracks, verify track list renders
   - Test artist flow: /artists → click artist → see albums → click album → see tracks
   - Test sidebar navigation: verify all sidebar links work
2. Write error-states.spec.ts:
   - Test 404 page: navigate to /nonexistent, verify error handling
   - Test unauthorized access: access /users as listener (if role-restricted in frontend)
3. Verify tests pass headless

## Inputs

- `Page components, routing structure`

## Expected Output

- `musicode-ui/e2e/navigation.spec.ts`
- `musicode-ui/e2e/error-states.spec.ts`

## Verification

npx playwright test e2e/navigation.spec.ts e2e/error-states.spec.ts passes headless.
