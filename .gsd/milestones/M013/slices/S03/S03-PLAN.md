# S03: Visualizer in overlay + track transition animations

**Goal:** Integrate visualizer into Now Playing overlay with mode switching, and add smooth artwork crossfade on track changes
**Demo:** Inside Now Playing overlay, toggle visualizer on — canvas renders full-size behind artwork. Switch between bars/waveform/circular modes. Change track — artwork crossfades smoothly.

## Must-Haves

- Visualizer renders full-size inside the Now Playing overlay with mode switching. Artwork crossfades smoothly when track changes. All existing tests pass.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Visualizer integration in overlay** `est:25m`
  Add visualizer toggle to Now Playing overlay. When active, the visualizer canvas renders behind/around the artwork at larger size. Reuse existing Visualizer component or its drawing functions. Mode selector available within overlay.
  - Files: `musicode-ui/src/components/player/NowPlayingOverlay.tsx`, `musicode-ui/src/index.css`
  - Verify: Visualizer renders in overlay, modes switch, canvas resizes properly

- [x] **T02: Artwork crossfade on track change** `est:15m`
  When track changes while overlay is open, the artwork transitions with a smooth crossfade animation rather than instant swap. Use CSS transition or dual-image approach.
  - Files: `musicode-ui/src/components/player/NowPlayingOverlay.tsx`, `musicode-ui/src/index.css`
  - Verify: Track change produces visible crossfade animation on artwork

- [x] **T03: Verify build and tests** `est:5m`
  Run TypeScript check and all tests to confirm no regressions.
  - Verify: tsc --noEmit clean, vitest --run all green

## Files Likely Touched

- musicode-ui/src/components/player/NowPlayingOverlay.tsx
- musicode-ui/src/index.css
