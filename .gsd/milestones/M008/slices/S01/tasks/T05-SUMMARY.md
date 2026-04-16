---
id: T05
parent: S01
milestone: M008
key_files:
  - musicode-server/src/test/java/com/musicode/service/ActivityServiceTest.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-16T18:01:38.482Z
blocker_discovered: false
---

# T05: ActivityService SSE unit tests: 11 tests covering subscribe, broadcast, dead-emitter cleanup, recent-buffer cap

**ActivityService SSE unit tests: 11 tests covering subscribe, broadcast, dead-emitter cleanup, recent-buffer cap**

## What Happened

Wrote ActivityServiceTest with 11 cases. Coverage: subscribe returns live emitter + count increments; multiple clients tracked independently; broadcast populates the recent buffer newest-first; buffer caps at 20 with oldest evicted (verified with 25 broadcasts); unknown-artist/album fallbacks; broadcast calls send() on all active emitters (mocks injected via ReflectionTestUtils); emitters that throw IOException during send are removed from the active list; broadcast with zero emitters still records the event in recent; getRecent() returns an unmodifiable copy; fresh service has zero connections. Dropped the planned `onCompletion` test — Spring's `SseEmitter.complete()` does not fire the registered completion callback until an HTTP handler attaches, which is integration-level not unit-level. Dead-emitter removal is already covered by the IOException path.

## Verification

`mvn -Dtest=ActivityServiceTest test` → 11 passed in 1.1s.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn -Dtest=ActivityServiceTest test` | 0 | pass | 1084ms |

## Deviations

The plan mentioned that `subscribe()` should replay recent events — the code does not do that (`getRecent()` is a separate endpoint). Tested actual behavior. Also dropped the onCompletion/timeout/error callback tests: they're Spring-infrastructure-dependent and not meaningfully unit-testable.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/service/ActivityServiceTest.java`
