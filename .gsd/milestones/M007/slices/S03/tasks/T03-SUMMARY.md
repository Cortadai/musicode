---
id: T03
parent: S03
milestone: M007
key_files:
  - musicode-server/src/main/java/com/musicode/service/ScrobbleService.java
  - musicode-server/src/main/java/com/musicode/controller/PlayController.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-17T19:34:37.176Z
blocker_discovered: false
---

# T03: ScrobbleService async orchestrator with retry and PlayController integration

**ScrobbleService async orchestrator with retry and PlayController integration**

## What Happened

ScrobbleService with @Async scrobble method. Checks user config: if listenbrainzToken set → ListenBrainzService, if lastfmSessionKey set → LastfmService. Exponential backoff retry (1s→2s→4s, max 3). Fire-and-forget from PlayController — never blocks playback response, never throws. Commit: 8927e40.

## Verification

Play a track → scrobble log entry appears. Async execution doesn't block response.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn clean verify` | 0 | pass | 45000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/ScrobbleService.java`
- `musicode-server/src/main/java/com/musicode/controller/PlayController.java`
