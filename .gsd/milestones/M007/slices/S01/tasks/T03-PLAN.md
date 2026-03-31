---
estimated_steps: 12
estimated_files: 8
skills_used: []
---

# T03: Stats service + API endpoints

1. Create StatsService with methods: getTopArtists, getTopAlbums, getTopTracks, getSummary, getHistory
2. Each method accepts userId and period (WEEK, MONTH, YEAR, ALL_TIME)
3. Use JPQL or native queries in PlaybackEventRepository for aggregation
4. Create StatsController with GET endpoints:
   - /api/stats/top-artists?period=month&limit=10
   - /api/stats/top-albums?period=month&limit=10
   - /api/stats/top-tracks?period=month&limit=10
   - /api/stats/summary?period=month
   - /api/stats/history?period=month (plays per day)
5. Create DTO records: TopArtistStat, TopAlbumStat, TopTrackStat, StatsSummary, DailyPlayCount
6. Add OpenAPI annotations
7. Verify: seed some PlaybackEvents, call endpoints, verify correct aggregation

## Inputs

- `PlaybackEvent entity`
- `PlaybackEventRepository`

## Expected Output

- `StatsService.java`
- `StatsController.java`
- `DTO records`

## Verification

curl /api/stats/top-artists?period=month returns JSON array with artist name and play count. curl /api/stats/summary returns totals.
