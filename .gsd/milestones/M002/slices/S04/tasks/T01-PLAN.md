---
estimated_steps: 11
estimated_files: 1
skills_used: []
---

# T01: JaCoCo coverage enforcement in backend

Why: Need automated coverage enforcement at 80% threshold for backend.

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

## Inputs

- `musicode-server/pom.xml`
- `All existing test files`

## Expected Output

- `musicode-server/target/site/jacoco/index.html`

## Verification

cd musicode-server && mvn verify
