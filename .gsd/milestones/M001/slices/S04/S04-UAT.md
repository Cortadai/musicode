# S04: Player + Queue — Full Playback Experience — UAT

**Milestone:** M001
**Written:** 2026-03-30T09:34:42.166Z

## UAT: S04 — Player + Queue\n\n### Test 1: Click to Play\n1. Open album detail page\n2. Click any track\n3. **Expected:** Audio starts playing, player bar appears at bottom, track highlighted in list\n\n### Test 2: Player Controls\n1. Click pause → audio pauses\n2. Click play → audio resumes\n3. Click next → next track plays\n4. Click prev → previous track or restart\n5. **Expected:** All controls work, player bar updates\n\n### Test 3: Seek\n1. Click on progress bar at ~50%\n2. **Expected:** Audio jumps to mid-point, time display updates\n\n### Test 4: Volume\n1. Click volume slider\n2. Click mute button\n3. **Expected:** Volume changes, mute toggles\n\n### Test 5: Queue\n1. Click track 3 in album\n2. Click next twice\n3. **Expected:** Plays track 4, then track 5"
