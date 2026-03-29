---
id: T03
parent: S01
milestone: M001
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/service/LibraryScanService.java", "musicode-server/src/main/java/com/musicode/service/CoverArtService.java", "musicode-server/src/main/java/com/musicode/controller/LibraryController.java", "musicode-server/src/main/java/com/musicode/controller/TrackController.java", "musicode-server/src/main/java/com/musicode/model/dto/ScanStatus.java", "musicode-server/src/main/java/com/musicode/config/AsyncConfig.java"]
key_decisions: ["EAGER fetch for Track→Album and Track→Artist (always needed when displaying a track)", "@JsonIgnoreProperties for bidirectional JPA relations instead of DTOs (simpler for MVP)", "Added TrackController early since it was needed for verification"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Full integration test: POST folder → POST scan → scan completes (17 files, 0 errors) → GET /api/tracks returns 17 tracks with correct metadata, album, and artist. Re-scan correctly shows 0 new, 17 updated. Cover art file exists at data/covers/1.jpg. All prior tests still pass."
completed_at: 2026-03-29T19:13:40.442Z
blocker_discovered: false
---

# T03: LibraryScanService scans FLAC folders asynchronously, upserts Artist/Album/Track entities, extracts cover art, and exposes scan progress via REST API.

> LibraryScanService scans FLAC folders asynchronously, upserts Artist/Album/Track entities, extracts cover art, and exposes scan progress via REST API.

## What Happened
---
id: T03
parent: S01
milestone: M001
key_files:
  - musicode-server/src/main/java/com/musicode/service/LibraryScanService.java
  - musicode-server/src/main/java/com/musicode/service/CoverArtService.java
  - musicode-server/src/main/java/com/musicode/controller/LibraryController.java
  - musicode-server/src/main/java/com/musicode/controller/TrackController.java
  - musicode-server/src/main/java/com/musicode/model/dto/ScanStatus.java
  - musicode-server/src/main/java/com/musicode/config/AsyncConfig.java
key_decisions:
  - EAGER fetch for Track→Album and Track→Artist (always needed when displaying a track)
  - @JsonIgnoreProperties for bidirectional JPA relations instead of DTOs (simpler for MVP)
  - Added TrackController early since it was needed for verification
duration: ""
verification_result: passed
completed_at: 2026-03-29T19:13:40.442Z
blocker_discovered: false
---

# T03: LibraryScanService scans FLAC folders asynchronously, upserts Artist/Album/Track entities, extracts cover art, and exposes scan progress via REST API.

**LibraryScanService scans FLAC folders asynchronously, upserts Artist/Album/Track entities, extracts cover art, and exposes scan progress via REST API.**

## What Happened

Built the full library scanning pipeline. AsyncConfig enables @Async. LibraryScanService walks directories, filters .flac files, reads metadata via MetadataService, and upserts Artist/Album/Track entities with deduplication (artist by name, album by title+artist). CoverArtService extracts embedded cover art during scan and caches as JPG at data/covers/{albumId}.jpg. ScanStatus DTO tracks progress (total, processed, errors, new/updated counts). LibraryController provides folder CRUD (POST/GET/DELETE /api/library/folders), scan trigger (POST /api/library/scan), and status polling (GET /api/library/scan/status). Added TrackController with GET /api/tracks for verification. Hit and fixed two serialization issues: LazyInitializationException (switched to EAGER for Track→Album/Artist) and JSON infinite recursion (added @JsonIgnoreProperties on bidirectional relations). Verified against 17 real FLACs: first scan creates 17 tracks, re-scan correctly updates 17 with 0 new. Cover art extracted (101KB JPEG).

## Verification

Full integration test: POST folder → POST scan → scan completes (17 files, 0 errors) → GET /api/tracks returns 17 tracks with correct metadata, album, and artist. Re-scan correctly shows 0 new, 17 updated. Cover art file exists at data/covers/1.jpg. All prior tests still pass.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `POST /api/library/folders` | 0 | ✅ pass — folder registered | 200ms |
| 2 | `POST /api/library/scan + GET /api/library/scan/status` | 0 | ✅ pass — 17 files, 17 new, 0 errors, COMPLETED | 3200ms |
| 3 | `GET /api/tracks | count` | 0 | ✅ pass — 17 tracks returned with metadata | 300ms |
| 4 | `POST /api/library/scan (re-scan)` | 0 | ✅ pass — 0 new, 17 updated | 3200ms |
| 5 | `ls data/covers/1.jpg` | 0 | ✅ pass — 101KB cover art extracted | 50ms |
| 6 | `mvn test -q` | 0 | ✅ pass — all tests pass | 6700ms |


## Deviations

Added TrackController (GET /api/tracks) ahead of plan — needed for verification and will be needed by T05. Changed Track and Album fetch strategy from LAZY to EAGER for album/artist relations to avoid LazyInitializationException when serializing to JSON. Added @JsonIgnoreProperties to all bidirectional JPA relationships to prevent infinite recursion in Jackson serialization.

## Known Issues

ScanStatus is in-memory only — lost on restart. Not a problem for MVP since H2 data persists and re-scan is fast.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/LibraryScanService.java`
- `musicode-server/src/main/java/com/musicode/service/CoverArtService.java`
- `musicode-server/src/main/java/com/musicode/controller/LibraryController.java`
- `musicode-server/src/main/java/com/musicode/controller/TrackController.java`
- `musicode-server/src/main/java/com/musicode/model/dto/ScanStatus.java`
- `musicode-server/src/main/java/com/musicode/config/AsyncConfig.java`


## Deviations
Added TrackController (GET /api/tracks) ahead of plan — needed for verification and will be needed by T05. Changed Track and Album fetch strategy from LAZY to EAGER for album/artist relations to avoid LazyInitializationException when serializing to JSON. Added @JsonIgnoreProperties to all bidirectional JPA relationships to prevent infinite recursion in Jackson serialization.

## Known Issues
ScanStatus is in-memory only — lost on restart. Not a problem for MVP since H2 data persists and re-scan is fast.
