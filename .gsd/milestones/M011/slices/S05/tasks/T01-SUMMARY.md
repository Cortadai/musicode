---
id: T01
parent: S05
milestone: M011
key_files:
  - musicode-server/src/main/java/com/musicode/model/dto/ScrobbleResult.java
  - musicode-server/src/main/java/com/musicode/service/LastfmService.java
  - musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java
key_decisions:
  - ScrobbleResult as Java record with ErrorType enum and isRetryable() method
  - RestClientException (parent of all) goes to UNKNOWN — typed subclasses caught first
duration: 
verification_result: passed
completed_at: 2026-04-18T17:45:15.785Z
blocker_discovered: false
---

# T01: Typed error classification in LastfmService and ListenBrainzService with ScrobbleResult DTO

**Typed error classification in LastfmService and ListenBrainzService with ScrobbleResult DTO**

## What Happened

Replaced boolean returns with ScrobbleResult record containing success/errorType/message. Both services now catch HttpClientErrorException (401/403→AUTH_ERROR), HttpServerErrorException (5xx→SERVER_ERROR), ResourceAccessException (timeout/connection→TIMEOUT), and fallback Exception (→UNKNOWN). Config check returns CONFIG_ERROR. Log markers differentiate: LASTFM_AUTH_ERROR, LASTFM_TIMEOUT, LASTFM_SERVER_ERROR, LB_AUTH_ERROR, LB_TIMEOUT, LB_SERVER_ERROR. Updated all unit tests (LastfmServiceTest, ListenBrainzServiceTest) and WireMock tests to assert ScrobbleResult.

## Verification

mvn test — 236 tests pass, 0 failures

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn test` | 0 | pass | 45000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/model/dto/ScrobbleResult.java`
- `musicode-server/src/main/java/com/musicode/service/LastfmService.java`
- `musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java`
