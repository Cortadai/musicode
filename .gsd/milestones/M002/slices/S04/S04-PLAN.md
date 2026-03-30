# S04: Coverage enforcement — JaCoCo + Vitest thresholds at 80%

**Goal:** Enforce 80% line coverage on both stacks. Builds fail if coverage drops below threshold.
**Demo:** After this: mvn verify and npm test --coverage both enforce 80% line coverage. Build fails if coverage drops below.

## Tasks
- [x] **T01: JaCoCo configured with 80% line coverage threshold \u2014 44 backend tests, all checks met.** — Why: Need automated coverage enforcement at 80% threshold for backend.

Files: `musicode-server/pom.xml`

Do:
1. Add JaCoCo Maven plugin to pom.xml.
2. Configure `prepare-agent` goal for instrumentation.
3. Configure `report` goal to generate HTML/XML reports.
4. Configure `check` goal with rule: BUNDLE, LINE counter, COVEREDRATIO minimum 0.80.
5. Bind check to `verify` phase.
6. Run `mvn verify` and check report. If coverage is below 80%, add tests for uncovered code until threshold is met.

Verify: `cd musicode-server && mvn verify`
Done when: JaCoCo check passes with ≥80% line coverage.
  - Estimate: 45m
  - Files: musicode-server/pom.xml
  - Verify: cd musicode-server && mvn verify
- [x] **T02: Vitest coverage configured with v8 \u2014 89% lines, 94% branches, thresholds enforced.** — Why: Need automated coverage enforcement at 80% threshold for frontend.

Files: `musicode-ui/vite.config.ts`, `musicode-ui/package.json`

Do:
1. Install `@vitest/coverage-v8`.
2. Add coverage config to vite.config.ts test section: provider 'v8', thresholds for lines/functions/branches at 80%.
3. Add `test:coverage` script to package.json.
4. Run `npm run test:coverage` and check report. If coverage is below 80%, add tests for uncovered code until threshold is met.

Verify: `cd musicode-ui && npm run test:coverage`
Done when: Vitest coverage check passes with ≥80% line coverage.
  - Estimate: 30m
  - Files: musicode-ui/vite.config.ts, musicode-ui/package.json
  - Verify: cd musicode-ui && npm run test:coverage
