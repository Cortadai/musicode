# S01: Backend Foundation — Scan FLACs and Stream Audio

**Goal:** Prove the core technical bet: JAudioTagger reads FLAC metadata, Spring Boot stores it in H2, and streams audio with HTTP Range support. A FLAC plays in Chrome with seek.
**Demo:** After this: Point browser at a test HTML page served by Spring Boot. Select a FLAC from the scanned library. Audio plays with working seek.

## Tasks
- [x] **T01: Scaffolded Spring Boot 3 + Java 21 project with 4 JPA entities, repositories, and H2 file-mode database.** — Create the musicode-server Maven project with Spring Boot 3 + Java 21. Define JPA entities (Track, Album, Artist, LibraryFolder) and Spring Data repositories. Configure H2 in file mode with auto-DDL.

Steps:
1. Generate Spring Boot project (spring-boot-starter-web, data-jpa, h2, devtools, validation, lombok)
2. Create entity classes with JPA annotations and relationships
3. Create Spring Data JPA repositories
4. Configure application.yml: H2 file mode, show-sql, ddl-auto=update
5. Verify app starts and tables are created
  - Estimate: 1h
  - Files: musicode-server/pom.xml, musicode-server/src/main/java/com/musicode/model/entity/Track.java, musicode-server/src/main/java/com/musicode/model/entity/Album.java, musicode-server/src/main/java/com/musicode/model/entity/Artist.java, musicode-server/src/main/java/com/musicode/model/entity/LibraryFolder.java, musicode-server/src/main/java/com/musicode/repository/TrackRepository.java, musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java, musicode-server/src/main/java/com/musicode/repository/ArtistRepository.java, musicode-server/src/main/java/com/musicode/repository/LibraryFolderRepository.java, musicode-server/src/main/resources/application.yml
  - Verify: cd musicode-server && mvn spring-boot:run — app starts on :8080, H2 console shows TRACK, ALBUM, ARTIST, LIBRARY_FOLDER tables
- [x] **T02: MetadataService reads FLAC metadata (title, artist, album, duration, cover art) using JAudioTagger 2.2.5.** — Create MetadataService that reads FLAC file metadata using JAudioTagger 3.x. Extract: title, artist, album, year, track number, disc number, duration, genre, bitrate, sample rate, bits per sample, and embedded cover art (as byte array).

Steps:
1. Add jaudiotagger dependency to pom.xml
2. Create MetadataService with a readMetadata(Path filePath) method
3. Return a structured DTO with all extracted fields
4. Handle edge cases: missing tags, missing cover art, corrupted files
5. Write a test with a real FLAC file
  - Estimate: 45m
  - Files: musicode-server/pom.xml, musicode-server/src/main/java/com/musicode/service/MetadataService.java, musicode-server/src/main/java/com/musicode/model/dto/TrackMetadata.java
  - Verify: mvn test -pl musicode-server -Dtest=MetadataServiceTest — test passes reading metadata from a real FLAC file
- [ ] **T03: LibraryScanService — Async folder scanning with upsert** — Create LibraryScanService that asynchronously walks a directory tree, filters .flac files, reads metadata via MetadataService, and upserts Artist/Album/Track entities in H2. Deduplicates artists by name and albums by (title + artist).

Steps:
1. Enable @Async in Spring config
2. Create LibraryScanService with scanFolder(String path) method
3. Walk directory tree with Files.walk(), filter .flac
4. For each file: read metadata, find-or-create Artist, find-or-create Album, create/update Track
5. Extract cover art during scan, save as JPG to data/covers/{albumId}.jpg
6. Track scan progress: files found, processed, errors, completion status
7. Create ScanStatus DTO for progress reporting
8. Create LibraryController with POST /api/library/scan and GET /api/library/scan/status
  - Estimate: 1.5h
  - Files: musicode-server/src/main/java/com/musicode/service/LibraryScanService.java, musicode-server/src/main/java/com/musicode/config/AsyncConfig.java, musicode-server/src/main/java/com/musicode/model/dto/ScanStatus.java, musicode-server/src/main/java/com/musicode/controller/LibraryController.java, musicode-server/src/main/java/com/musicode/service/CoverArtService.java
  - Verify: Start app, POST /api/library/scan with a folder containing FLACs, GET /api/library/scan/status shows completion, query H2 console to verify tracks/albums/artists persisted correctly
- [ ] **T04: AudioStreamService — HTTP Range streaming for FLACs** — Create AudioStreamService that serves FLAC files with HTTP Range header support (206 Partial Content). This enables seeking in 30-80MB files without full download.

Steps:
1. Create AudioStreamService with streamTrack(Long trackId, HttpServletRequest, HttpServletResponse)
2. Read Range header, calculate byte ranges
3. Return 206 Partial Content with correct Content-Range, Content-Length, Accept-Ranges headers
4. Return 200 with full content when no Range header present
5. Set Content-Type to audio/flac
6. Create StreamController with GET /api/stream/{trackId}
7. Test with curl using Range headers
  - Estimate: 1h
  - Files: musicode-server/src/main/java/com/musicode/service/AudioStreamService.java, musicode-server/src/main/java/com/musicode/controller/StreamController.java
  - Verify: curl -H 'Range: bytes=0-1023' http://localhost:8080/api/stream/1 — returns 206 with Content-Range header and 1024 bytes of audio data
- [ ] **T05: Test page — End-to-end playback proof in browser** — Create a minimal HTML test page served by Spring Boot that proves the full chain works: lists scanned tracks from the API, and plays them via an HTML5 <audio> element with seek.

Steps:
1. Create a static HTML page at src/main/resources/static/test.html
2. Fetch tracks from /api/tracks (add a basic GET /api/tracks endpoint if not yet present)
3. Render a simple list of tracks with click-to-play
4. Wire <audio> element with src=/api/stream/{trackId}
5. Add CORS config for development (WebMvcConfigurer)
6. Test: scan a real folder, open test.html, click a track, verify audio plays with seek
  - Estimate: 45m
  - Files: musicode-server/src/main/resources/static/test.html, musicode-server/src/main/java/com/musicode/config/WebConfig.java, musicode-server/src/main/java/com/musicode/controller/TrackController.java
  - Verify: Open http://localhost:8080/test.html in Chrome — click a track — audio plays — drag the seek bar — audio jumps to new position
