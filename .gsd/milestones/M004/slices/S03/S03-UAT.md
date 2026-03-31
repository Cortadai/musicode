# S03: Frontend Error Handling, Logging & Comments — UAT

**Milestone:** M004
**Written:** 2026-03-31T10:24:36.693Z

## UAT: S03 \u2014 Frontend Error Handling, Logging & Comments\n\n### Test 1: ErrorBoundary catches crashes\n1. (Dev only) Introduce a throw in a component render\n2. **Expected:** ErrorBoundary shows \"Something went wrong\" with Reload button\n\n### Test 2: ErrorMessage with retry\n1. Stop the backend, navigate to Albums\n2. **Expected:** ErrorMessage with \"Failed to load albums\", network error detail, \"Try again\" button\n3. Start backend, click \"Try again\"\n4. **Expected:** Albums load normally\n\n### Test 3: console.debug visible\n1. Open browser DevTools console (verbose/debug level)\n2. Login\n3. **Expected:** [auth] messages for session check and login success\n\n### Test 4: Test suite\n1. Run `npm run test:coverage`\n2. **Expected:** 40 tests pass, coverage thresholds met
