# S01: Backend — LRCLIB integration + DB cache

**Goal:** Integrate LRCLIB.net API with lazy fetch and DB caching for lyrics
**Demo:** GET /api/lyrics/{trackId} returns cached synced/plain lyrics from LRCLIB

## Must-Haves

- Lyrics endpoint returns synced, plain, instrumental, or not-found status. Repeated calls serve from cache. NOT_FOUND cached with retry support.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Flyway migration + Track entity fields + LyricsStatus enum** `est:30min`
  Add V2 Flyway migration with syncedLyrics (TEXT), plainLyrics (TEXT), lyricsStatus (VARCHAR) columns to track table. Create LyricsStatus enum (NOT_SEARCHED, SYNCED, PLAIN_ONLY, INSTRUMENTAL, NOT_FOUND). Update Track entity with new fields and @Enumerated annotation.
  - Files: `musicode-server/src/main/resources/db/migration/V2__add_lyrics_columns.sql`, `musicode-server/src/main/java/com/musicode/model/entity/Track.java`, `musicode-server/src/main/java/com/musicode/model/entity/LyricsStatus.java`
  - Verify: Spring Boot starts cleanly with migration applied, Track entity compiles with new fields

- [x] **T02: LyricsService — LRCLIB client + caching logic** `est:1h`
  Create LyricsService that calls LRCLIB.net GET /api/get with trackName, artistName, albumName, duration params. Parse response: synced lyrics, plain lyrics, instrumental flag. Cache result in Track entity via TrackRepository. Handle NOT_FOUND caching. Add retry support (reset NOT_FOUND status). Use @Value for API base URL for testability.
  - Files: `musicode-server/src/main/java/com/musicode/service/LyricsService.java`, `musicode-server/src/main/java/com/musicode/model/dto/LyricsResponse.java`
  - Verify: Unit tests pass for all response types (synced, plain, instrumental, not found, API error). WireMock contract test validates actual HTTP call to LRCLIB.

- [x] **T03: LyricsController + endpoint tests** `est:45min`
  Create LyricsController with GET /api/lyrics/{trackId} that returns cached lyrics or triggers lazy fetch. Add POST /api/lyrics/{trackId}/retry to reset NOT_FOUND and re-fetch. Return LyricsResponse DTO with status, syncedLyrics, plainLyrics fields.
  - Files: `musicode-server/src/main/java/com/musicode/controller/LyricsController.java`, `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`
  - Verify: Integration tests: authenticated GET returns lyrics, retry resets cache, 404 for unknown track. SecurityConfig permits /api/lyrics/** for authenticated users.

## Files Likely Touched

- musicode-server/src/main/resources/db/migration/V2__add_lyrics_columns.sql
- musicode-server/src/main/java/com/musicode/model/entity/Track.java
- musicode-server/src/main/java/com/musicode/model/entity/LyricsStatus.java
- musicode-server/src/main/java/com/musicode/service/LyricsService.java
- musicode-server/src/main/java/com/musicode/model/dto/LyricsResponse.java
- musicode-server/src/main/java/com/musicode/controller/LyricsController.java
- musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
