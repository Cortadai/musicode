# S01: Backend Foundation — Scan FLACs and Stream Audio — UAT

**Milestone:** M001
**Written:** 2026-03-30T08:27:32.334Z

## UAT: S01 — Backend Foundation\n\n### Test 1: Library Scan\n1. Start server: `cd musicode-server && mvn spring-boot:run`\n2. POST `http://localhost:8080/api/library/scan` with body `{\"path\": \"C:\\\\Users\\\\david\\\\Music\\\\After The Neon Fades - Echo Synth\"}`\n3. GET `http://localhost:8080/api/library/scan/status`\n4. **Expected:** status shows completed, 17 files processed, 0 errors\n\n### Test 2: Track Listing\n1. GET `http://localhost:8080/api/tracks`\n2. **Expected:** JSON array of 17 tracks with title, artist, album, duration, bitrate\n\n### Test 3: Audio Streaming\n1. `curl -H 'Range: bytes=0-1023' http://localhost:8080/api/stream/1`\n2. **Expected:** HTTP 206, Content-Range header, 1024 bytes of audio/flac\n\n### Test 4: End-to-End Playback\n1. Open `http://localhost:8080/test.html` in Chrome\n2. Click any track in the list\n3. **Expected:** Audio plays, seek bar works, player shows now-playing info
