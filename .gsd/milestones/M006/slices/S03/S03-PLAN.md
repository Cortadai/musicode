# S03: Playwright Extended Flows + CI Config

**Goal:** Extend Playwright test coverage to secondary flows (search, settings, artists, tracks) and error states. Configure for CI execution.
**Demo:** After this: After this: E2E suite covers search, settings/library management, error states, and artist/track views. Tests run in CI-ready headless mode with HTML report.

## Tasks
- [ ] **T01: Search + settings E2E tests** — 1. Write search.spec.ts:
   - Test search with results: type query, verify results appear for tracks/albums/artists
   - Test search click: click a result, verify navigation to detail page
   - Test empty search: search for nonsense, verify empty state message
2. Write settings.spec.ts:
   - Test view settings: login as admin, navigate to /settings
   - Test library folder management if scan is safe in test context
3. Verify tests pass headless
  - Estimate: 30min
  - Files: musicode-ui/e2e/search.spec.ts, musicode-ui/e2e/settings.spec.ts
  - Verify: npx playwright test e2e/search.spec.ts e2e/settings.spec.ts passes headless.
- [ ] **T02: Navigation + error state E2E tests** — 1. Write navigation.spec.ts:
   - Test tracks page: login, navigate to /tracks, verify track list renders
   - Test artist flow: /artists → click artist → see albums → click album → see tracks
   - Test sidebar navigation: verify all sidebar links work
2. Write error-states.spec.ts:
   - Test 404 page: navigate to /nonexistent, verify error handling
   - Test unauthorized access: access /users as listener (if role-restricted in frontend)
3. Verify tests pass headless
  - Estimate: 30min
  - Files: musicode-ui/e2e/navigation.spec.ts, musicode-ui/e2e/error-states.spec.ts
  - Verify: npx playwright test e2e/navigation.spec.ts e2e/error-states.spec.ts passes headless.
- [ ] **T03: CI config + documentation + final verification** — 1. Update playwright.config.ts for CI:
   - retries: 2 in CI, 0 in local
   - reporter: html + list
   - screenshot: only-on-failure
   - trace: retain-on-failure
2. Add .gitignore entries for test-results/, playwright-report/
3. Update musicode-ui/README.md with E2E test instructions
4. Update root README.md with E2E section
5. Run full suite: npx playwright test — all pass
6. Run existing tests: npm run test:coverage, verify no regressions
7. Commit all
  - Estimate: 20min
  - Files: musicode-ui/playwright.config.ts, musicode-ui/.gitignore, musicode-ui/README.md, README.md
  - Verify: npx playwright test passes headless. npm run test:coverage passes. git diff shows no unexpected changes.
