# S01: Playback Tracking + Stats API — UAT

**Milestone:** M007
**Written:** 2026-04-17T19:33:32.819Z

## UAT: S01 — Playback Tracking + Stats API\n\n- [x] Play a track past 50% → POST /api/plays/{trackId} fires once\n- [x] Play same track again → new PlaybackEvent created\n- [x] GET /api/stats/top-artists?period=month → ranked list by play count\n- [x] GET /api/stats/summary → total plays, listening time, unique artists/albums\n- [x] GET /api/stats/history?period=month → daily play counts\n- [x] Stats are user-scoped via Principal\n- [x] mvn clean verify passes
