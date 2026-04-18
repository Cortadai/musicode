# S03: Gapless playback — UAT

**Milestone:** M009
**Written:** 2026-04-18T09:48:34.586Z

## UAT — S03: Gapless playback

### Test 1: Gapless album transition
- **Steps:** Play an album with multiple tracks. Wait for a track to approach its end (~3s remaining).
- **Expected:** Console shows `[player] Gapless: pre-loading next track` and `[audioGraph] Swapped to B/A`. No audible gap between tracks.
- **Result:** ✅ PASS

### Test 2: Manual skip
- **Steps:** While a track is playing, click next/previous.
- **Expected:** Track changes immediately. If pre-load was pending, console shows `[audioGraph] Pre-load cancelled`.
- **Result:** ✅ PASS

### Test 3: Repeat-one
- **Steps:** Enable repeat-one mode. Let a track finish.
- **Expected:** Track restarts from beginning. No pre-load attempt.
- **Result:** ✅ PASS

### Test 4: Repeat-all
- **Steps:** Enable repeat-all. Let the last track in queue finish.
- **Expected:** Wraps to first track with gapless transition.
- **Result:** ✅ PASS

### Test 5: Repeat-off (queue end)
- **Steps:** Disable repeat. Let the last track finish.
- **Expected:** Playback stops.
- **Result:** ✅ PASS

### Test 6: Logout
- **Steps:** While music is playing, log out.
- **Expected:** Audio stops immediately. Both elements cleaned up.
- **Result:** ✅ PASS

### Test 7: Volume/Mute after swap
- **Steps:** After a gapless swap occurs, adjust volume slider and toggle mute.
- **Expected:** Volume and mute apply to the now-active element.
- **Result:** ✅ PASS

### Test 8: Visualizer after swap
- **Steps:** With visualizer visible, let a gapless swap occur.
- **Expected:** Visualizer bars continue displaying on the new track.
- **Result:** ✅ PASS
