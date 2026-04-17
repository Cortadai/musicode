# S02: Playwright E2E — Setup + Core Flows

**Goal:** Install Playwright, configure test project, write E2E tests for the critical user flows: authentication, library browsing, audio playback, and admin user management.
**Demo:** After this: After this: npx playwright test runs headless and verifies login → browse albums → play track → admin user CRUD. Clear pass/fail output.

## Tasks
- [x] **T01: Install Playwright + project config** — 1. cd musicode-ui && npm init playwright@latest (Chromium only for now)
2. Configure playwright.config.ts: baseURL http://localhost:5173, webServer for Vite dev, timeout, retries
3. Configure webServer to start Vite dev server automatically
4. Add test:e2e script to package.json
5. Write a smoke test (navigate to /, expect redirect to /login)
6. Run npx playwright test to verify setup
  - Estimate: 30min
  - Files: musicode-ui/playwright.config.ts, musicode-ui/package.json, musicode-ui/e2e/smoke.spec.ts
  - Verify: npx playwright test e2e/smoke.spec.ts passes headless.
- [x] **T02: Auth flow E2E tests** — 1. Write login.spec.ts:
   - Test valid login: fill username+password, submit, verify redirect to /
   - Test invalid credentials: fill wrong password, verify error message shown
   - Test logout: login, click logout, verify redirect to /login
2. Create test helpers: login function reusable across specs
3. Verify tests pass headless
  - Estimate: 30min
  - Files: musicode-ui/e2e/login.spec.ts, musicode-ui/e2e/helpers.ts
  - Verify: npx playwright test e2e/login.spec.ts passes headless.
- [x] **T03: Browse + playback E2E tests** — 1. Write browse.spec.ts:
   - Test albums page: login, verify album cards render with cover art
   - Test album detail: click album, verify track list appears
   - Test artist page: navigate to artists, verify artist list
   - Test artist detail: click artist, verify albums shown
2. Write playback.spec.ts:
   - Test play track: login, navigate to album, click first track
   - Verify player bar appears with track title
   - Verify audio element currentTime advances (> 0 after short wait)
   - Test pause: click pause, verify currentTime stops advancing
3. Verify all tests pass headless
  - Estimate: 45min
  - Files: musicode-ui/e2e/browse.spec.ts, musicode-ui/e2e/playback.spec.ts
  - Verify: npx playwright test e2e/browse.spec.ts e2e/playback.spec.ts passes headless.
- [x] **T04: Admin user management E2E tests + stability** — 1. Write admin.spec.ts:
   - Test create user: login as admin, navigate to /users, create new user
   - Verify user appears in list
   - Test delete user: delete the created user, verify removed from list
   - Test cannot delete self: verify error when trying to delete admin
2. Run full test suite 5 consecutive times to verify stability
3. Verify no regressions: npm run test:coverage, mvn clean verify
  - Estimate: 30min
  - Files: musicode-ui/e2e/admin.spec.ts
  - Verify: npx playwright test passes headless. Run 5 times with 0 failures. npm run test:coverage passes.
