---
id: T03
parent: S01
milestone: M007
key_files:
  - musicode-server/src/main/java/com/musicode/service/StatsService.java
  - musicode-server/src/main/java/com/musicode/controller/StatsController.java
  - musicode-server/src/main/java/com/musicode/model/dto/TopArtistStat.java
  - musicode-server/src/main/java/com/musicode/model/dto/StatsSummary.java
  - musicode-server/src/main/java/com/musicode/model/dto/DailyPlayCount.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-17T19:33:12.973Z
blocker_discovered: false
---

# T03: StatsService + StatsController with top-artists/albums/tracks, summary, and history endpoints

**StatsService + StatsController with top-artists/albums/tracks, summary, and history endpoints**

## What Happened

Created StatsService with JPQL aggregation queries supporting period filtering (WEEK, MONTH, YEAR, ALL_TIME). StatsController exposes 5 GET endpoints. DTO records: TopArtistStat, TopAlbumStat, TopTrackStat, StatsSummary, DailyPlayCount. Uses Principal for user-scoped stats.

## Verification

curl /api/stats/top-artists?period=month returns ranked JSON. curl /api/stats/summary returns totals.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `curl /api/stats/top-artists?period=month` | 0 | pass | 2000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/StatsService.java`
- `musicode-server/src/main/java/com/musicode/controller/StatsController.java`
- `musicode-server/src/main/java/com/musicode/model/dto/TopArtistStat.java`
- `musicode-server/src/main/java/com/musicode/model/dto/StatsSummary.java`
- `musicode-server/src/main/java/com/musicode/model/dto/DailyPlayCount.java`
