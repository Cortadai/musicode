---
id: S02
parent: M001
milestone: M001
provides:
  - GET /api/albums (paginated) + GET /api/albums/{id} (with tracks)
  - GET /api/artists (paginated) + GET /api/artists/{id} (with albums)
  - GET /api/tracks (paginated, sortable) + GET /api/tracks/{id}
  - GET /api/covers/{albumId} (image/jpeg)
  - GET /api/search?q= (tracks + albums + artists)
requires:
  - slice: S01
    provides: Track/Album/Artist entities and repositories
affects:
  - S03
key_files:
  - musicode-server/src/main/java/com/musicode/controller/AlbumController.java
  - musicode-server/src/main/java/com/musicode/controller/ArtistController.java
  - musicode-server/src/main/java/com/musicode/controller/CoverArtController.java
  - musicode-server/src/main/java/com/musicode/controller/SearchController.java
  - musicode-server/src/main/java/com/musicode/config/JacksonConfig.java
key_decisions:
  - jackson-datatype-hibernate6 for lazy proxy handling instead of open-in-view
  - Artist collections as Set to avoid MultipleBagFetchException
  - Cover art cached 7 days via Cache-Control
patterns_established:
  - EntityGraph for detail views, Hibernate6Module for list views (lazy = null)
  - Cover art served via Spring Resource with Cache-Control
observability_surfaces:
  - All endpoints return structured JSON errors with status codes
drill_down_paths:
  - .gsd/milestones/M001/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S02/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-30T09:07:20.038Z
blocker_discovered: false
---

# S02: Browse API + Cover Art

**Complete browse API: paginated tracks/albums/artists, album+artist detail, cover art serving, and global search.**

## What Happened

Built the complete browse API across 3 tasks. T01 created paginated endpoints for tracks, albums, and artists with EntityGraph-based detail views, resolving Hibernate lazy loading issues along the way. T02 added cover art serving with proper Cache-Control headers. T03 implemented global search across all three entity types. All endpoints verified via curl against the running server with 17 pre-scanned tracks.

## Verification

All 3 tasks verified via curl. Albums list+detail, artists list+detail, tracks paginated+sorted, cover art 200/404, search with matches/empty/no-matches all return correct responses.

## Requirements Advanced

- R003 — Paginated browse endpoints for tracks, albums, artists
- R002 — Cover art served via /api/covers/{albumId} with caching
- R005 — Global search across tracks, albums, artists

## Requirements Validated

- R003 — All browse endpoints return paginated JSON with correct data
- R002 — Cover art extracted during scan and served as cached JPGs via /api/covers/{albumId}

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Added jackson-datatype-hibernate6 dependency and JacksonConfig to handle lazy proxy serialization (not originally planned). Changed Artist entity collections from List to Set to fix Hibernate MultipleBagFetchException.

## Known Limitations

Search uses LIKE queries — fine for personal libraries but won't scale to millions of tracks.

## Follow-ups

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/controller/TrackController.java` — Paginated tracks with GET /{id} detail
- `musicode-server/src/main/java/com/musicode/controller/AlbumController.java` — Paginated albums list + album detail with EntityGraph tracks
- `musicode-server/src/main/java/com/musicode/controller/ArtistController.java` — Paginated artists list + artist detail with EntityGraph albums
- `musicode-server/src/main/java/com/musicode/controller/CoverArtController.java` — Serve cover art JPGs with 7-day cache
- `musicode-server/src/main/java/com/musicode/controller/SearchController.java` — Global search across tracks/albums/artists
- `musicode-server/src/main/java/com/musicode/model/dto/SearchResults.java` — Search results DTO
- `musicode-server/src/main/java/com/musicode/config/JacksonConfig.java` — Hibernate6Module for lazy proxy handling
- `musicode-server/src/main/java/com/musicode/model/entity/Artist.java` — Artist collections changed from List to Set
- `musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java` — Added EntityGraph and search queries
- `musicode-server/src/main/java/com/musicode/repository/ArtistRepository.java` — Added EntityGraph and search queries
- `musicode-server/src/main/java/com/musicode/repository/TrackRepository.java` — Added search query
- `musicode-server/pom.xml` — Added jackson-datatype-hibernate6 dependency
