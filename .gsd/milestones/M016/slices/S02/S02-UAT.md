# S02: Frontend — Canvas waveform + seek integration — UAT

**Milestone:** M016
**Written:** 2026-04-25T16:55:26.236Z

## UAT: S02 — Frontend waveform display\n\n### Test 1: Waveform renders on playback\n- Play any track\n- Waveform bars should appear in player bar (white = played, gray = unplayed)\n\n### Test 2: Click to seek\n- Click anywhere on the waveform\n- Playback should jump to that position\n\n### Test 3: Toggle to flat bar\n- Click the waveform toggle icon (Activity icon)\n- Should switch to classic flat progress bar\n- Click again to return to waveform\n- Preference survives page reload\n\n### Test 4: NowPlayingOverlay\n- Open fullscreen overlay\n- Waveform should display and seek should work there too
