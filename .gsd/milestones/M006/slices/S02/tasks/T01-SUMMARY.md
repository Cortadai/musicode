---
id: T01
parent: S02
milestone: M006
key_files:
  - musicode-ui/playwright.config.ts
  - musicode-ui/package.json
  - musicode-ui/e2e/smoke.spec.ts
  - musicode-ui/e2e/helpers.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-17T19:55:18.097Z
blocker_discovered: false
---

# T01: Installed Playwright with Chromium, configured project with webServer for Vite, wrote smoke test

**Installed Playwright with Chromium, configured project with webServer for Vite, wrote smoke test**

## What Happened

Ran npm init playwright@latest (Chromium only). Configured playwright.config.ts with baseURL localhost:5173, webServer to auto-start Vite, sequential execution (workers:1) for shared H2 DB, retain-on-failure traces. Added test:e2e script to package.json. Smoke test verifies unauthenticated access redirects to /login.

## Verification

npx playwright test e2e/smoke.spec.ts passes headless.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx playwright test e2e/smoke.spec.ts` | 0 | pass | 2000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/playwright.config.ts`
- `musicode-ui/package.json`
- `musicode-ui/e2e/smoke.spec.ts`
- `musicode-ui/e2e/helpers.ts`
