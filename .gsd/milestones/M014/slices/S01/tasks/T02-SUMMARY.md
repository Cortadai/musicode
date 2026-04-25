---
id: T02
parent: S01
milestone: M014
key_files:
  - musicode-server/src/main/java/com/musicode/repository/TrackRepository.java
  - musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-25T17:07:08.507Z
blocker_discovered: false
---

# T02: Added custom JPQL queries for health checks to TrackRepository and AlbumRepository

**Added custom JPQL queries for health checks to TrackRepository and AlbumRepository**

## What Happened

Added paginated JPQL queries for tracks with filename-like titles, albums without cover art flag, and albums with mixed artists across tracks. All queries use Pageable for server-side pagination.

## Verification

Integration tests with H2 validate query results. mvn -B verify: 272 tests, 0 failures.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn -B verify` | 0 | pass | 28000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/repository/TrackRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java`
