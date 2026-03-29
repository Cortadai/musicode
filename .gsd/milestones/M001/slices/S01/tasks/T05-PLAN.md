---
estimated_steps: 8
estimated_files: 3
skills_used: []
---

# T05: Test page — End-to-end playback proof in browser

Create a minimal HTML test page served by Spring Boot that proves the full chain works: lists scanned tracks from the API, and plays them via an HTML5 <audio> element with seek.

Steps:
1. Create a static HTML page at src/main/resources/static/test.html
2. Fetch tracks from /api/tracks (add a basic GET /api/tracks endpoint if not yet present)
3. Render a simple list of tracks with click-to-play
4. Wire <audio> element with src=/api/stream/{trackId}
5. Add CORS config for development (WebMvcConfigurer)
6. Test: scan a real folder, open test.html, click a track, verify audio plays with seek

## Inputs

- `musicode-server/src/main/java/com/musicode/controller/StreamController.java`
- `musicode-server/src/main/java/com/musicode/controller/LibraryController.java`

## Expected Output

- `musicode-server/src/main/resources/static/test.html`
- `musicode-server/src/main/java/com/musicode/config/WebConfig.java`
- `musicode-server/src/main/java/com/musicode/controller/TrackController.java`

## Verification

Open http://localhost:8080/test.html in Chrome — click a track — audio plays — drag the seek bar — audio jumps to new position
