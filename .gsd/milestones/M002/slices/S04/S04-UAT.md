# S04: Coverage enforcement — JaCoCo + Vitest thresholds at 80% — UAT

**Milestone:** M002
**Written:** 2026-03-30T19:55:55.575Z

## UAT: Coverage Enforcement\n\n### Test 1: Backend coverage gate\n- Run: `cd musicode-server && mvn clean verify`\n- Expected: BUILD SUCCESS, \"All coverage checks have been met\", 44 tests 0 failures\n\n### Test 2: Frontend coverage gate\n- Run: `cd musicode-ui && npm run test:coverage`\n- Expected: 29 tests pass, coverage thresholds met (lines \u226580%, branches \u226580%, functions \u226550%)\n\n### Test 3: Coverage gate enforcement (negative)\n- If a new untested class is added to the backend, `mvn verify` should fail with JaCoCo check error\n- If a new untested file is added to frontend context/ or utils/, `npm run test:coverage` should fail
