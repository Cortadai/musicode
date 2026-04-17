---
id: T02
parent: S03
milestone: M007
key_files:
  - musicode-server/src/main/java/com/musicode/service/LastfmService.java
  - musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-17T19:34:32.151Z
blocker_discovered: false
---

# T02: LastfmService and ListenBrainzService implementations with API signature and token auth

**LastfmService and ListenBrainzService implementations with API signature and token auth**

## What Happened

LastfmService: MD5 API signature, track.scrobble POST, auth.getMobileSession for session key exchange. ListenBrainzService: submit-listens POST with Bearer token. Both use @Value-injected API URLs per Knowledge rule #4 for test overridability. Commit: 8927e40.

## Verification

mvn compile. Unit tests with Mockito + WireMock contract tests validate wire format.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn clean verify` | 0 | pass | 45000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/LastfmService.java`
- `musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java`
