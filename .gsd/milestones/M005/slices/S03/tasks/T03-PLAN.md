---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: PlayerBar integration + micro-animations

Add visualizer toggle button to PlayerBar (Activity/BarChart3 icon from Lucide). Wire Visualizer component above the progress bar area, toggleable. Initialize AudioContext on first play (call initAudioContext from usePlayer's play actions). Add CSS micro-animations: 1) PlayerBar slide-up transition when currentTrack goes from null to set (CSS transform + transition). 2) Cover art fade-in on load (opacity transition on img onLoad). 3) Album cover in PlayerBar rotates while playing (CSS animate-spin, slower — 8s duration, pauses when !isPlaying via animation-play-state). Verify build and tests pass.

## Inputs

- `Visualizer from T02`
- `useAudioAnalyser from T01`
- `Current PlayerBar.tsx`

## Expected Output

- `Updated PlayerBar.tsx with visualizer toggle + micro-animations`
- `Updated AlbumCard.tsx with cover fade-in`

## Verification

npm run build + npm run test:coverage — all pass
