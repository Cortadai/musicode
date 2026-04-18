# S01: AudioGraph centralizado — UAT

**Milestone:** M009
**Written:** 2026-04-18T08:40:29.438Z

## UAT — S01: AudioGraph centralizado

### Preconditions
- Musicode UI running at localhost:5173
- At least one album scanned in the library

### Test Cases

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | Click play on any track | Track plays, console shows `[audioGraph] Graph initialized` | ✅ PASS |
| 2 | Pause / Resume | Playback pauses and resumes | ✅ PASS |
| 3 | Seek (click progress bar) | Playback jumps to clicked position | ✅ PASS |
| 4 | Volume slider | Volume changes smoothly | ✅ PASS |
| 5 | Next / Previous | Track changes correctly | ✅ PASS |
| 6 | Shuffle toggle | Shuffle mode toggles | ✅ PASS |
| 7 | Repeat toggle | Repeat mode toggles | ✅ PASS |
| 8 | Visualizer toggle | Frequency bars display | ✅ PASS |
| 9 | Media Session keys | Keyboard media keys respond | ✅ PASS |
| 10 | Logout while playing | Music stops immediately | ✅ PASS |
| 11 | Console errors | Zero errors in browser console | ✅ PASS |

### Known Issues
- Cover art shows same image for both test albums — backend bug in CoverArtService, not related to M009
