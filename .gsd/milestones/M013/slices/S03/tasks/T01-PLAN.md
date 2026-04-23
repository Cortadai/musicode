---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Visualizer integration in overlay

Add visualizer toggle to Now Playing overlay. When active, the visualizer canvas renders behind/around the artwork at larger size. Reuse existing Visualizer component or its drawing functions. Mode selector available within overlay.

## Inputs

- `Visualizer component`
- `useAudioAnalyser`

## Expected Output

- `Updated NowPlayingOverlay with visualizer integration`

## Verification

Visualizer renders in overlay, modes switch, canvas resizes properly
