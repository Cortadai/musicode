---
id: T02
parent: S01
milestone: M008
key_files:
  - musicode-server/src/test/java/com/musicode/service/LastfmServiceTest.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-16T17:57:55.494Z
blocker_discovered: false
---

# T02: LastfmService unit tests: 16 tests covering signature, auth, scrobble happy/error paths

**LastfmService unit tests: 16 tests covering signature, auth, scrobble happy/error paths**

## What Happened

Wrote LastfmServiceTest with 16 cases. Used ReflectionTestUtils to swap the inline `new RestTemplate()` with a Mockito mock — avoided refactoring production code for an injection point that's not needed anywhere else. Coverage: isConfigured (3 variants), generateSignature determinism against a hand-computed MD5 fixture (invoked via reflection since the method is private), authenticate (blank config / success / no session / exception / form-encoded payload shape), scrobble (blank config / 2xx success / non-2xx / exception / full payload with optional album+duration / omitted album+duration when null / artist fallback to "Unknown"). Payload assertions capture the HttpEntity and inspect the MultiValueMap body directly.

## Verification

`mvn -Dtest=LastfmServiceTest test` → 16 passed, 0 failed.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn -Dtest=LastfmServiceTest test` | 0 | pass | 1551ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/service/LastfmServiceTest.java`
