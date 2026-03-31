# S01: Playback Tracking + Stats API

**Goal:** Create PlaybackEvent entity, record plays from frontend, build stats query endpoints.
**Demo:** After this: After this: play several tracks in the browser, then curl /api/stats/summary shows play count and listening time. curl /api/stats/top-artists returns ranked list.

## Tasks
- [ ] **T01: PlaybackEvent entity + record play endpoint** — 1. Create PlaybackEvent entity: id, user (ManyToOne), track (ManyToOne), playedAt (Instant), listenDurationSec (Integer)
2. Create PlaybackEventRepository with JpaRepository
3. Create PlayController with POST /api/plays/{trackId} — accepts optional listenDurationSec in request body
4. Endpoint resolves authenticated user from SecurityContext, creates PlaybackEvent
5. Add OpenAPI annotations
6. Verify: start server, login, POST to /api/plays/1, check H2 console for row
  - Estimate: 25min
  - Files: musicode-server/src/main/java/com/musicode/model/entity/PlaybackEvent.java, musicode-server/src/main/java/com/musicode/repository/PlaybackEventRepository.java, musicode-server/src/main/java/com/musicode/controller/PlayController.java
  - Verify: mvn compile succeeds. curl POST /api/plays/{trackId} returns 201 with event data.
- [ ] **T02: Frontend — report play at 50% duration** — 1. In usePlayer.ts, add a ref to track whether current track has been reported
2. In the timeupdate handler, check if currentTime > duration * 0.5
3. If threshold crossed and not yet reported, POST /api/plays/{trackId} with listenDurationSec
4. Reset the reported flag when track changes
5. Add the API function in a new api/plays.ts file
6. Verify: play a track past 50%, check network tab for POST request
  - Estimate: 20min
  - Files: musicode-ui/src/hooks/usePlayer.ts, musicode-ui/src/api/plays.ts
  - Verify: Play a track past 50% in the browser. Network tab shows POST /api/plays/{trackId} with 201 response.
- [ ] **T03: Stats service + API endpoints** — 1. Create StatsService with methods: getTopArtists, getTopAlbums, getTopTracks, getSummary, getHistory
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
  - Estimate: 40min
  - Files: musicode-server/src/main/java/com/musicode/service/StatsService.java, musicode-server/src/main/java/com/musicode/controller/StatsController.java, musicode-server/src/main/java/com/musicode/repository/PlaybackEventRepository.java, musicode-server/src/main/java/com/musicode/model/dto/TopArtistStat.java, musicode-server/src/main/java/com/musicode/model/dto/TopAlbumStat.java, musicode-server/src/main/java/com/musicode/model/dto/TopTrackStat.java, musicode-server/src/main/java/com/musicode/model/dto/StatsSummary.java, musicode-server/src/main/java/com/musicode/model/dto/DailyPlayCount.java
  - Verify: curl /api/stats/top-artists?period=month returns JSON array with artist name and play count. curl /api/stats/summary returns totals.
- [ ] **T04: Tests + verification** — 1. Write StatsController integration tests: top-artists, top-albums, top-tracks, summary, history
2. Write PlayController test: record play, duplicate handling
3. Add Swagger annotations to all new endpoints
4. Run mvn clean verify — all tests pass, coverage ≥80%
5. Run npx playwright test — no regressions
6. Manual verification: play tracks in browser, check stats endpoints return correct data
  - Estimate: 30min
  - Files: musicode-server/src/test/java/com/musicode/controller/PlayControllerTest.java, musicode-server/src/test/java/com/musicode/controller/StatsControllerTest.java
  - Verify: mvn clean verify passes. npx playwright test passes. Stats endpoints return correct aggregations.
