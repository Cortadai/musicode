---
estimated_steps: 6
estimated_files: 2
skills_used: []
---

# T04: Tests + verification

1. Write StatsController integration tests: top-artists, top-albums, top-tracks, summary, history
2. Write PlayController test: record play, duplicate handling
3. Add Swagger annotations to all new endpoints
4. Run mvn clean verify — all tests pass, coverage ≥80%
5. Run npx playwright test — no regressions
6. Manual verification: play tracks in browser, check stats endpoints return correct data

## Inputs

- `All new controllers and services`

## Expected Output

- `PlayControllerTest.java`
- `StatsControllerTest.java`
- `All tests green`

## Verification

mvn clean verify passes. npx playwright test passes. Stats endpoints return correct aggregations.
