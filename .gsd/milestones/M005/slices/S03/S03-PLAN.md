# S03: Spectrum Visualizer & Micro-animations

**Goal:** Add real-time audio spectrum visualizer and CSS micro-animations for visual polish
**Demo:** After this: After this: frequency spectrum bars animate in real-time during playback. PlayerBar fades in smoothly on first play. Cover art fades in on load. Cover disc spins while playing.

## Tasks
- [x] **T01: AudioContext + AnalyserNode hook with lazy init and single-connection guard.** — Create hooks/useAudioAnalyser.ts — manages AudioContext + AnalyserNode lifecycle. Creates AudioContext on first call (lazy — avoids autoplay policy block). Connects to globalAudio via createMediaElementSource (once, guarded by module-level flag). Returns analyserNode and a boolean indicating if the context is ready. Exports initAudioContext() that can be called on user gesture. The AudioContext must be resumed on user gesture if in 'suspended' state (Chrome autoplay policy).
  - Estimate: 15min
  - Files: musicode-ui/src/hooks/useAudioAnalyser.ts
  - Verify: npm run build compiles
- [x] **T02: Canvas 2D frequency visualizer with indigo bars, rAF, and visibility-aware pausing.** — Create components/player/Visualizer.tsx — Canvas 2D component that renders frequency bars. Uses useAudioAnalyser() to get the AnalyserNode. On each requestAnimationFrame: getByteFrequencyData() into Uint8Array, draw bars on canvas with indigo gradient. Pauses animation when isPlaying=false or document is hidden (Page Visibility API). Accepts visible prop to show/hide. Bars should be responsive to canvas width. Style: indigo bars with slight transparency, matching the app theme.
  - Estimate: 20min
  - Files: musicode-ui/src/components/player/Visualizer.tsx
  - Verify: npm run build compiles
- [x] **T03: Visualizer toggle in PlayerBar + slide-up, disc spin, and cover fade-in animations.** — Add visualizer toggle button to PlayerBar (Activity/BarChart3 icon from Lucide). Wire Visualizer component above the progress bar area, toggleable. Initialize AudioContext on first play (call initAudioContext from usePlayer's play actions). Add CSS micro-animations: 1) PlayerBar slide-up transition when currentTrack goes from null to set (CSS transform + transition). 2) Cover art fade-in on load (opacity transition on img onLoad). 3) Album cover in PlayerBar rotates while playing (CSS animate-spin, slower — 8s duration, pauses when !isPlaying via animation-play-state). Verify build and tests pass.
  - Estimate: 25min
  - Files: musicode-ui/src/components/player/PlayerBar.tsx, musicode-ui/src/components/library/AlbumCard.tsx
  - Verify: npm run build + npm run test:coverage — all pass
