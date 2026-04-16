---
id: T03
parent: S01
milestone: M008
key_files:
  - musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceTest.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-16T17:58:39.266Z
blocker_discovered: false
---

# T03: ListenBrainzService unit tests: 6 tests covering bearer auth, single-listen payload, and error paths

**ListenBrainzService unit tests: 6 tests covering bearer auth, single-listen payload, and error paths**

## What Happened

Wrote ListenBrainzServiceTest with 6 cases. Same ReflectionTestUtils pattern as LastfmService to swap the inline RestTemplate. Coverage: 2xx success, non-2xx failure, RestClientException swallowed, Authorization header uses "Token {token}" format with application/json, payload structure (listen_type=single, payload[0].listened_at=epoch, track_metadata has artist_name/track_name/release_name), and fallback to "Unknown" when artist/album are null. Verified payload assertions by deserializing the captured Map body directly.

## Verification

`mvn -Dtest=ListenBrainzServiceTest test` → 6 passed, 0 failed.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn -Dtest=ListenBrainzServiceTest test` | 0 | pass | 1549ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceTest.java`
