---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Migrate UI components and verify zero regressions

Update PlayerBar.tsx: replace initAudioContext() calls with audioGraph.init(). Update Visualizer.tsx: get analyser from audioGraph instead of useAudioAnalyser hook. Verify in browser: play a track, pause, seek, next/prev, volume slider, shuffle, repeat, visualizer toggle, Media Session keys (play/pause/next/prev via keyboard), scrobble fires at 50%. Check console for errors.

## Inputs

- `T02 migrated usePlayer.ts`
- `T01 audioGraph.ts`
- `Current PlayerBar.tsx and Visualizer.tsx`

## Expected Output

- `PlayerBar uses audioGraph.init() instead of initAudioContext()`
- `Visualizer gets analyser from audioGraph`
- `All player features work identically to pre-M009`
- `Zero console errors`

## Verification

Manual browser verification: play FLAC track end-to-end, seek, volume, visualizer, Media Session, next/prev, shuffle, repeat. Zero console errors. Scrobble fires at 50%.
