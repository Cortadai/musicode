---
id: T03
parent: S01
milestone: M015
key_files:
  - musicode-server/src/main/java/com/musicode/controller/LyricsController.java
  - musicode-server/src/main/java/com/musicode/model/dto/LyricsResponse.java
  - musicode-server/src/test/java/com/musicode/controller/LyricsControllerTest.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-25T15:45:39.942Z
blocker_discovered: false
---

# T03: LyricsController with GET/POST endpoints + LyricsResponse DTO + 5 integration tests

**LyricsController with GET/POST endpoints + LyricsResponse DTO + 5 integration tests**

## What Happened

GET /api/lyrics/{trackId} fetches/caches lyrics. POST /api/lyrics/{trackId}/retry forces re-fetch. LyricsResponse DTO wraps trackId, status, syncedLyrics, plainLyrics. 5 integration tests covering auth required, track not found, and happy path scenarios.

## Verification

5 controller tests pass. Full mvn test suite (260 tests) passes with 0 failures.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn test` | 0 | pass | 45000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/controller/LyricsController.java`
- `musicode-server/src/main/java/com/musicode/model/dto/LyricsResponse.java`
- `musicode-server/src/test/java/com/musicode/controller/LyricsControllerTest.java`
