# S01: Media Session API — UAT

**Milestone:** M005
**Written:** 2026-03-31T10:54:59.083Z

## UAT: S01 \u2014 Media Session API\n\n### Test 1: Keyboard media keys\n1. Play a track in Musicode\n2. Press keyboard Play/Pause media key\n3. **Expected:** Track pauses. Press again \u2192 resumes.\n4. Press Next Track media key\n5. **Expected:** Next track in queue plays.\n\n### Test 2: OS now-playing overlay\n1. Play a track with cover art\n2. Check Windows media overlay (volume popup) or macOS Control Center\n3. **Expected:** Shows track title, artist name, and album cover art\n\n### Test 3: Seek bar\n1. Play a track, open OS media controls\n2. Drag the seek position\n3. **Expected:** Playback jumps to the new position\n\n### Test 4: Build and tests\n1. npm run build\n2. npm run test:coverage\n3. **Expected:** Both pass, no regressions
