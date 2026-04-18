# S02: Persistencia de preferencias en localStorage — UAT

**Milestone:** M009
**Written:** 2026-04-18T09:18:05.526Z

## UAT: S02 — Persistencia de preferencias en localStorage

### Test 1: Preferences persist across reload
1. Set volume to a non-default value (e.g. 0.3)
2. Enable shuffle, set repeat to "all"
3. Press F5 to reload
4. **Expected:** Volume, shuffle, and repeat mode restored to saved values
5. **Result:** ✅ PASS

### Test 2: localStorage clear resets to defaults
1. Open DevTools → Application → Local Storage
2. Delete the 'musicode-prefs' key
3. Reload page
4. **Expected:** Volume 0.8, shuffle off, repeat off — no console errors
5. **Result:** ✅ PASS

### Test 3: Controls functional after reload
1. Reload page (preferences restored)
2. Move volume slider
3. Click mute button
4. **Expected:** Volume changes audibly, mute silences audio
5. **Result:** ✅ PASS
