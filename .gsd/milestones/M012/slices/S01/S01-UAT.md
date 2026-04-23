# S01: Extract usePlayer into composable hooks — UAT

**Milestone:** M012
**Written:** 2026-04-18T18:28:36.799Z

## UAT: S01 — Extract usePlayer into composable hooks

### Pre-conditions
- App running at localhost with music library loaded

### Test Cases

#### TC1: Basic playback
1. Navigate to an album, click a track → plays
2. Pause → resumes → seek works
3. Next/prev buttons advance queue
- **Pass criteria:** Identical behavior to pre-refactor

#### TC2: Scrobble reporting
1. Play a track, let it reach past 50%
2. Check network tab for `POST /api/plays/{id}`
- **Pass criteria:** Single POST fires at 50%, not duplicated

#### TC3: Media Session
1. Play a track
2. Check OS media controls (lock screen / media overlay)
3. Verify title, artist, album art display
4. Use OS next/prev/play/pause controls
- **Pass criteria:** Metadata correct, controls functional

#### TC4: Gapless / Crossfade
1. Play a track, let it approach the end (~3s remaining)
2. Verify next track starts without gap
3. Enable crossfade (if crossfade UI exists), verify smooth transition
- **Pass criteria:** Gapless swap and crossfade work as before

#### TC5: Shuffle and Repeat
1. Toggle shuffle → queue randomizes, current track stays
2. Toggle repeat modes (off → all → one)
3. Verify end-of-queue behavior for each mode
- **Pass criteria:** Same behavior as pre-refactor
