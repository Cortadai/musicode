---
id: T03
parent: S02
milestone: M008
key_files:
  - musicode-server/src/test/java/com/musicode/controller/PlayScrobbleIntegrationTest.java
key_decisions:
  - Mock boundary at ScrobbleService+ActivityService — verified invocation args, not async threading (Spring infra)
duration: 
verification_result: passed
completed_at: 2026-04-17T15:58:05.837Z
blocker_discovered: false
---

# T03: PlayScrobbleIntegrationTest — 4 integration tests verifying play→scrobble and play→activity invocation chain

**PlayScrobbleIntegrationTest — 4 integration tests verifying play→scrobble and play→activity invocation chain**

## What Happened

@SpringBootTest integration test with @MockBean ScrobbleService and ActivityService as mock boundary. Uses ArgumentCaptor to verify the PlaybackEvent passed to scrobble() has correct trackId, userId, listenDurationSec, and playedAt. Tests: (1) play with duration invokes scrobble with correct event, (2) play invokes activity broadcast, (3) play without body still scrobbles with null duration, (4) invalid track returns 404 and never scrobbles/broadcasts. This closes the gap between PlayController and ScrobbleService — the wire from ScrobbleService to Last.fm/LB was already proved in S01.

## Verification

mvn test -Dtest=PlayScrobbleIntegrationTest — 4 tests, 0 failures

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn test -Dtest=PlayScrobbleIntegrationTest` | 0 | pass | 8000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/controller/PlayScrobbleIntegrationTest.java`
