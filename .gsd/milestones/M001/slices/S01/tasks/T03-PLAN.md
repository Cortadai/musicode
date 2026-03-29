---
estimated_steps: 10
estimated_files: 5
skills_used: []
---

# T03: LibraryScanService — Async folder scanning with upsert

Create LibraryScanService that asynchronously walks a directory tree, filters .flac files, reads metadata via MetadataService, and upserts Artist/Album/Track entities in H2. Deduplicates artists by name and albums by (title + artist).

Steps:
1. Enable @Async in Spring config
2. Create LibraryScanService with scanFolder(String path) method
3. Walk directory tree with Files.walk(), filter .flac
4. For each file: read metadata, find-or-create Artist, find-or-create Album, create/update Track
5. Extract cover art during scan, save as JPG to data/covers/{albumId}.jpg
6. Track scan progress: files found, processed, errors, completion status
7. Create ScanStatus DTO for progress reporting
8. Create LibraryController with POST /api/library/scan and GET /api/library/scan/status

## Inputs

- `musicode-server/src/main/java/com/musicode/service/MetadataService.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Track.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Album.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Artist.java`
- `musicode-server/src/main/java/com/musicode/repository/TrackRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/ArtistRepository.java`

## Expected Output

- `musicode-server/src/main/java/com/musicode/service/LibraryScanService.java`
- `musicode-server/src/main/java/com/musicode/config/AsyncConfig.java`
- `musicode-server/src/main/java/com/musicode/model/dto/ScanStatus.java`
- `musicode-server/src/main/java/com/musicode/controller/LibraryController.java`
- `musicode-server/src/main/java/com/musicode/service/CoverArtService.java`

## Verification

Start app, POST /api/library/scan with a folder containing FLACs, GET /api/library/scan/status shows completion, query H2 console to verify tracks/albums/artists persisted correctly
