---
id: T02
parent: S05
milestone: M011
key_files:
  - musicode-server/src/main/java/com/musicode/service/ScrobbleService.java
  - musicode-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java
key_decisions:
  - Exceptions (unexpected throws) still trigger retry — defensive against uncategorized failures
duration: 
verification_result: passed
completed_at: 2026-04-18T17:45:25.587Z
blocker_discovered: false
---

# T02: Smart retry in ScrobbleService — skip auth/config errors, retry only timeout/server errors

**Smart retry in ScrobbleService — skip auth/config errors, retry only timeout/server errors**

## What Happened

Changed ScrobbleService.retryWithBackoff from BooleanSupplier to Supplier<ScrobbleResult>. After each attempt, checks result.isRetryable() — AUTH_ERROR and CONFIG_ERROR bail immediately with a single log line. TIMEOUT and SERVER_ERROR retry with existing exponential backoff (1s, 2s, 4s). Exceptions still retry (defensive). Updated ScrobbleServiceTest with new scenarios: authError_noRetry, configError_noRetry, retryableError_retriesWithBackoff. All 15 ScrobbleService tests pass.

## Verification

mvn test — 236 tests pass, ScrobbleServiceTest 15/15 green

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn test` | 0 | pass | 45000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/ScrobbleService.java`
- `musicode-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java`
