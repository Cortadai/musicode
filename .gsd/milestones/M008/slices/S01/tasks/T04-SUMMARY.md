---
id: T04
parent: S01
milestone: M008
key_files:
  - musicode-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java
  - musicode-server/src/main/java/com/musicode/service/ScrobbleService.java
key_decisions:
  - Converted BASE_DELAY_MS from static final to an instance field to enable fast retry tests without sleep stubs — minimal change, production default unchanged.
duration: 
verification_result: passed
completed_at: 2026-04-16T17:59:59.541Z
blocker_discovered: false
---

# T04: ScrobbleService retry tests: 14 tests covering provider selection, backoff retries, fire-and-forget

**ScrobbleService retry tests: 14 tests covering provider selection, backoff retries, fire-and-forget**

## What Happened

Wrote ScrobbleServiceTest with 14 cases. To avoid multi-second sleeps from the exponential backoff (1s→2s→4s), changed `BASE_DELAY_MS` from a `static final` constant to a `baseDelayMs` instance field so tests can override it to 1ms via ReflectionTestUtils — this is the least-invasive refactor and keeps production behavior identical. Coverage: provider selection (none/only LB/only Lastfm/both/blank-string tokens), track-not-found short-circuit, success on first try (no retry), success after 1 or 2 retries (stops on success), exhaustion after 3 attempts when always false, exception path (fire-and-forget — never bubbles up), independent retries per provider, and verification that the reloaded track from the repository is the one passed to providers (not the stub on the event).

## Verification

`mvn -Dtest=ScrobbleServiceTest test` → 14 passed in 1.1s.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn -Dtest=ScrobbleServiceTest test` | 0 | pass | 1140ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java`
- `musicode-server/src/main/java/com/musicode/service/ScrobbleService.java`
