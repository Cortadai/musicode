---
id: T04
parent: S05
milestone: M011
key_files:
  - musicode-server/src/test/java/com/musicode/service/LastfmServiceWireMockTest.java
  - musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceWireMockTest.java
  - musicode-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T17:48:31.139Z
blocker_discovered: false
---

# T04: WireMock tests updated with ScrobbleResult error type assertions for all HTTP scenarios

**WireMock tests updated with ScrobbleResult error type assertions for all HTTP scenarios**

## What Happened

WireMock tests for both LastfmService and ListenBrainzService were updated alongside T01 to assert ScrobbleResult with typed ErrorType. Coverage: 401→AUTH_ERROR (non-retryable), 503→SERVER_ERROR (retryable), connection reset→TIMEOUT (retryable), 429→client error, 2xx→OK. Config error is covered by unit tests (no HTTP involved). ScrobbleServiceTest validates retry behavior: AUTH_ERROR/CONFIG_ERROR→no retry (1 call), TIMEOUT/SERVER_ERROR→retry up to 3 times. 34 tests across 3 classes, all green.

## Verification

mvn test -Dtest=*WireMockTest,ScrobbleServiceTest — 34 tests pass

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn test -Dtest=*WireMockTest,ScrobbleServiceTest` | 0 | pass | 15000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/service/LastfmServiceWireMockTest.java`
- `musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceWireMockTest.java`
- `musicode-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java`
