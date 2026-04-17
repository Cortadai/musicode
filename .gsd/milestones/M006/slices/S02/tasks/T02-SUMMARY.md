---
id: T02
parent: S02
milestone: M006
key_files:
  - musicode-ui/e2e/login.spec.ts
  - musicode-ui/e2e/helpers.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-17T19:55:25.713Z
blocker_discovered: false
---

# T02: Auth flow E2E tests: valid login, invalid credentials error, logout redirect

**Auth flow E2E tests: valid login, invalid credentials error, logout redirect**

## What Happened

Wrote login.spec.ts with 3 tests: valid login verifies redirect to app shell with sidebar, invalid credentials shows error message, logout redirects to /login and blocks re-access. Created reusable login/logout helpers in helpers.ts.

## Verification

npx playwright test e2e/login.spec.ts — 3 tests pass.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx playwright test e2e/login.spec.ts` | 0 | pass — 3 tests | 3000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/e2e/login.spec.ts`
- `musicode-ui/e2e/helpers.ts`
