---
id: S01
parent: M001
milestone: M001
provides:
  - Track/Album/Artist entities and repositories
  - GET /api/tracks — list all tracks
  - GET /api/stream/{trackId} — audio streaming with Range support
  - POST /api/library/scan — trigger folder scan
  - GET /api/library/scan/status — scan progress
  - MetadataService for reading audio file metadata
  - CoverArtService for extracting/caching album covers
  - CORS config for frontend dev
requires:
  []
affects:
  - S02
  - S03
  - S04
key_files:
  - musicode-server/src/main/java/com/musicode/service/AudioStreamService.java
  - musicode-server/src/main/java/com/musicode/service/LibraryScanService.java
  - musicode-server/src/main/java/com/musicode/service/MetadataService.java
  - musicode-server/src/main/resources/static/test.html
key_decisions:
  - JAudioTagger 2.2.5 (3.x not available)
  - EAGER fetch for Track→Album/Artist
  - RandomAccessFile for Range streaming (not Spring ResourceRegion)
  - H2 file mode with ddl-auto=update
  - @JsonIgnoreProperties for bidirectional JPA instead of DTOs
patterns_established:
  - JPA entities with EAGER fetch + @JsonIgnoreProperties for API serialization
  - Async scan with progress tracking via atomic status DTO
  - HTTP Range streaming with RandomAccessFile
  - Content-Type resolution from file extension
observability_surfaces:
  - GET /api/library/scan/status — scan progress (files found, processed, errors, completion)
  - Spring Boot logging at DEBUG level for com.musicode
drill_down_paths:
  - .gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T03-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T04-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T05-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-30T08:27:32.334Z
blocker_discovered: false
---

# S01: Backend Foundation — Scan FLACs and Stream Audio

**Backend foundation complete: scan FLACs, read metadata, store in H2, stream with HTTP Range seek — proven end-to-end in browser.**

## What Happened

Built the complete backend foundation across 5 tasks. T01 scaffolded the Spring Boot project with 4 JPA entities and H2 file-mode database. T02 implemented MetadataService reading FLAC metadata via JAudioTagger (title, artist, album, duration, cover art, bitrate, sample rate, etc). T03 added async library scanning with progress tracking — scans folders, upserts Artist/Album/Track entities, and extracts cover art as cached JPGs. T04 implemented HTTP Range streaming (206 Partial Content) for audio files, enabling seek in 30-80MB FLACs. T05 created a test HTML page proving the full chain: 17 tracks from a real music folder displayed in a dark-themed list, click to play via HTML5 audio element, seek works via Range headers. The core technical bet is proven: JAudioTagger reads metadata, Spring Boot stores it, and streams audio with seek support.

## Verification

All 5 tasks verified independently. Final E2E: 17 FLACs scanned → tracks listed in browser → click to play → audio streams with working seek. HTTP Range verified with curl (206 + correct headers). Browser playback confirmed with programmatic seek test.

## Requirements Advanced

- R001 — LibraryScanService scans configured folders for FLAC files and reads metadata
- R002 — MetadataService extracts title, artist, album, duration, cover art from FLAC tags
- R004 — AudioStreamService serves audio with HTTP 206 Range support for seeking

## Requirements Validated

- R001 — POST /api/library/scan scans folder, 17 FLAC files detected and persisted
- R002 — All metadata fields (title, artist, album, year, duration, bitrate, sample rate) correctly extracted and stored
- R004 — curl Range requests return 206 with correct Content-Range; audio plays with seek in browser

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Used JAudioTagger 2.2.5 instead of 3.x (3.x unavailable in Maven Central). No impact on functionality.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `musicode-server/pom.xml` — Spring Boot 3 + Java 21 project with JPA, H2, JAudioTagger, Lombok dependencies
- `musicode-server/src/main/java/com/musicode/model/entity/Track.java` — Track entity with metadata fields, ManyToOne to Album and Artist
- `musicode-server/src/main/java/com/musicode/model/entity/Album.java` — Album entity with cover art path
- `musicode-server/src/main/java/com/musicode/model/entity/Artist.java` — Artist entity
- `musicode-server/src/main/java/com/musicode/model/entity/LibraryFolder.java` — LibraryFolder entity for configured scan paths
- `musicode-server/src/main/java/com/musicode/service/MetadataService.java` — Reads FLAC/MP3/OGG metadata via JAudioTagger
- `musicode-server/src/main/java/com/musicode/service/LibraryScanService.java` — Async folder scanner with progress tracking
- `musicode-server/src/main/java/com/musicode/service/CoverArtService.java` — Extracts and caches album cover art as JPG
- `musicode-server/src/main/java/com/musicode/service/AudioStreamService.java` — HTTP Range streaming (206 Partial Content) for audio files
- `musicode-server/src/main/java/com/musicode/controller/StreamController.java` — GET /api/stream/{trackId} endpoint
- `musicode-server/src/main/java/com/musicode/controller/LibraryController.java` — POST /api/library/scan and GET /api/library/scan/status
- `musicode-server/src/main/java/com/musicode/controller/TrackController.java` — GET /api/tracks endpoint
- `musicode-server/src/main/java/com/musicode/config/WebConfig.java` — CORS configuration for frontend dev
- `musicode-server/src/main/java/com/musicode/config/AsyncConfig.java` — Spring @EnableAsync configuration
- `musicode-server/src/main/resources/static/test.html` — E2E test page proving scan→browse→stream→seek chain
- `musicode-server/src/main/resources/application.yml` — H2 file-mode config, server port, logging
