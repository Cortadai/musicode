---
estimated_steps: 9
estimated_files: 2
skills_used: []
---

# T04: AudioStreamService — HTTP Range streaming for FLACs

Create AudioStreamService that serves FLAC files with HTTP Range header support (206 Partial Content). This enables seeking in 30-80MB files without full download.

Steps:
1. Create AudioStreamService with streamTrack(Long trackId, HttpServletRequest, HttpServletResponse)
2. Read Range header, calculate byte ranges
3. Return 206 Partial Content with correct Content-Range, Content-Length, Accept-Ranges headers
4. Return 200 with full content when no Range header present
5. Set Content-Type to audio/flac
6. Create StreamController with GET /api/stream/{trackId}
7. Test with curl using Range headers

## Inputs

- `musicode-server/src/main/java/com/musicode/model/entity/Track.java`
- `musicode-server/src/main/java/com/musicode/repository/TrackRepository.java`

## Expected Output

- `musicode-server/src/main/java/com/musicode/service/AudioStreamService.java`
- `musicode-server/src/main/java/com/musicode/controller/StreamController.java`

## Verification

curl -H 'Range: bytes=0-1023' http://localhost:8080/api/stream/1 — returns 206 with Content-Range header and 1024 bytes of audio data
