---
id: T02
parent: S01
milestone: M015
key_files:
  - musicode-server/src/main/java/com/musicode/service/LyricsService.java
  - musicode-server/src/test/java/com/musicode/service/LyricsServiceTest.java
key_decisions:
  - (none)
duration: 
verification_result: untested
completed_at: 2026-04-25T15:45:34.743Z
blocker_discovered: false
---

# T02: LyricsService with LRCLIB.net integration, lazy fetch, and DB caching

**LyricsService with LRCLIB.net integration, lazy fetch, and DB caching**

## What Happened

Built LyricsService calling LRCLIB.net GET /api/get with trackName, artistName, albumName, duration params. Lazy fetch on first access — caches synced/plain/instrumental/not-found status in Track entity. retryLyrics() clears cache for manual re-check. API URL is @Value-injected for testability. 10 unit tests covering all response scenarios.

## Verification

10 unit tests pass covering: synced lyrics, plain-only, instrumental, not found, retry, API errors.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| — | No verification commands discovered | — | — | — |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/LyricsService.java`
- `musicode-server/src/test/java/com/musicode/service/LyricsServiceTest.java`
