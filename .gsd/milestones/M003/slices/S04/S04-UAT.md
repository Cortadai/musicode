# S04: Frontend Auth Flow — UAT

**Milestone:** M003
**Written:** 2026-03-31T09:35:12.123Z

## UAT: S04 \u2014 Frontend Auth Flow\n\n### Test 1: Login required\n1. Open http://localhost:5173 without logging in\n2. **Expected:** Redirected to /login page with Musicode logo and form\n\n### Test 2: Login success\n1. Enter admin / changeme and submit\n2. **Expected:** Redirected to albums page, sidebar shows admin username + ADMIN badge, Settings and Users visible\n\n### Test 3: Login failure\n1. Enter wrong credentials\n2. **Expected:** Error message \"Invalid username or password\"\n\n### Test 4: Listener restricted UI\n1. Create a listener user via admin\n2. Login as listener\n3. **Expected:** Albums page loads, sidebar shows only Albums/Artists/Tracks/Search. No Settings or Users links.\n\n### Test 5: Session persistence\n1. Login as admin, close browser tab\n2. Reopen http://localhost:5173\n3. **Expected:** Still logged in (cookie session restored via getMe)\n\n### Test 6: Logout\n1. Click Sign out in sidebar\n2. **Expected:** Redirected to /login, cookies cleared\n\n### Test 7: Test suite\n1. Run `npm run test:coverage`\n2. **Expected:** 35 tests pass, coverage thresholds met
