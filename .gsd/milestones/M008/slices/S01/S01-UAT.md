# S01: Service Unit Tests + Coverage Restoration — UAT

**Milestone:** M008
**Written:** 2026-04-16T18:04:05.880Z

## Objective
Verify that previously-untested services now have unit test coverage, the JaCoCo exclusions hiding scrobble services have been removed, and the bundle coverage gate still passes at ≥80%.

## Test Scenarios

### 1. Each target service has a dedicated test class with passing tests
- Command: `mvn -Dtest=StatsServiceTest,LastfmServiceTest,ListenBrainzServiceTest,ScrobbleServiceTest,ActivityServiceTest test`
- Expected: All 60 tests pass (13 + 16 + 6 + 14 + 11). BUILD SUCCESS.

### 2. Scrobble services are no longer excluded from JaCoCo
- Command: `grep -E "LastfmService|ListenBrainzService|ScrobbleService" musicode-server/pom.xml`
- Expected: No matches inside the `<excludes>` block of the JaCoCo plugin.

### 3. `mvn clean verify` passes the coverage gate
- Command: `cd musicode-server && mvn clean verify`
- Expected: BUILD SUCCESS. Log line "All coverage checks have been met."

### 4. Bundle line coverage ≥ 80%
- Command: read `musicode-server/target/site/jacoco/jacoco.csv`, sum LINE_COVERED / (LINE_COVERED + LINE_MISSED)
- Expected: ≥ 80.00% (current: 87.10%).

### 5. Retry tests run fast
- Command: `mvn -Dtest=ScrobbleServiceTest test`
- Expected: Runs in <3s (backoff override to 1ms).

## Pass Criteria
All 5 scenarios pass. Coverage report in `target/site/jacoco/index.html` now includes scrobble-path data.
