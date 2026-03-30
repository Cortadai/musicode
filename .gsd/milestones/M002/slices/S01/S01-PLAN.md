# S01: Fixes + Multi-format Scanner

**Goal:** Clean up M001 data issues and extend scanner to all common audio formats (MP3, OGG, M4A, WAV).
**Demo:** After this: Scanner processes a folder with mixed FLAC/MP3/OGG/M4A files. No duplicate tracks. Cover art paths consistent.

## Tasks
- [x] **T01: Multi-format scanner (FLAC/MP3/OGG/M4A/WAV), normalized cover art paths, ScanStatus aligned with frontend.** — Extend the scanner file filter from FLAC-only to all supported formats. Normalize cover art paths to use the covers directory consistently. Fix the ScanStatus DTO to report the status fields the frontend expects.

Steps:
1. Change isFlacFile to isAudioFile — accept .flac, .mp3, .ogg, .m4a, .wav
2. Rename countFlacFiles to countAudioFiles
3. Normalize cover art path in CoverArtService — always store relative path pattern
4. Update ScanStatus DTO to match frontend interface (scanning boolean, filesFound, etc)
5. Test with running server
  - Estimate: 45m
  - Files: musicode-server/src/main/java/com/musicode/service/LibraryScanService.java, musicode-server/src/main/java/com/musicode/service/CoverArtService.java, musicode-server/src/main/java/com/musicode/model/dto/ScanStatus.java
  - Verify: Start server, scan folder with FLACs, verify scan completes and tracks have normalized cover art paths. API returns correct data.
