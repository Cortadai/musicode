# S01: Refactor PlayerBar — extraer componentes

**Goal:** Extraer componentes independientes de PlayerBar.tsx (465 LOC → ~80 LOC orquestador + 5 componentes). Reproducción, crossfade, EQ y visualizer funcionan idéntico post-refactor.
**Demo:** PlayerBar dividido en componentes independientes. Reproducción, crossfade, EQ y visualizer funcionan idéntico.

## Must-Haves

- PlayerBar.tsx ≤100 LOC. 5 componentes extraídos en musicode-ui/src/components/player/. Build sin errores. Todas las funcionalidades (play/pause, seek, volume, shuffle, repeat, crossfade, EQ, visualizer) funcionan idéntico en browser.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Extract TrackInfo component** `est:15min`
  Extract cover sleeve, vinyl disc animation, track title and artist link into TrackInfo.tsx. Props: currentTrack, isPlaying, albumId, hasCover.
  - Files: `musicode-ui/src/components/player/TrackInfo.tsx`, `musicode-ui/src/components/player/PlayerBar.tsx`
  - Verify: tsc --noEmit passes. TrackInfo renders cover art, vinyl animation, and track metadata.

- [x] **T02: Extract TransportControls and ProgressBar components** `est:15min`
  Extract play/pause/skip/shuffle/repeat buttons into TransportControls.tsx. Extract seek bar with time display into ProgressBar.tsx. TransportControls receives player actions as props. ProgressBar receives currentTime, duration, onSeek.
  - Files: `musicode-ui/src/components/player/TransportControls.tsx`, `musicode-ui/src/components/player/ProgressBar.tsx`, `musicode-ui/src/components/player/PlayerBar.tsx`
  - Verify: tsc --noEmit passes. Transport buttons and progress bar render correctly.

- [x] **T03: Extract VolumeControl, CrossfadePopover, and EqPopover components** `est:25min`
  Extract volume mute/slider into VolumeControl.tsx. Extract crossfade button+popover+state into CrossfadePopover.tsx (self-contained with own useState/useEffect for click-outside). Extract EQ button+popover+all EQ state management into EqPopover.tsx (self-contained — owns eqEnabled, eqBands, eqPreset state and all handlers).
  - Files: `musicode-ui/src/components/player/VolumeControl.tsx`, `musicode-ui/src/components/player/CrossfadePopover.tsx`, `musicode-ui/src/components/player/EqPopover.tsx`, `musicode-ui/src/components/player/PlayerBar.tsx`
  - Verify: tsc --noEmit passes. EQ popover opens/closes, bands adjust, presets apply. Crossfade slider works. Volume mute/unmute works.

- [x] **T04: Build verification and browser smoke test** `est:10min`
  Run tsc and vite build to confirm zero errors. Start dev server and verify in browser: play/pause, seek, volume, shuffle, repeat, crossfade slider, EQ bands+presets+toggle, visualizer 3 modes. Confirm no regressions.
  - Files: `musicode-ui/src/components/player/PlayerBar.tsx`
  - Verify: vite build succeeds. All 8 player features work in browser.

## Files Likely Touched

- musicode-ui/src/components/player/TrackInfo.tsx
- musicode-ui/src/components/player/PlayerBar.tsx
- musicode-ui/src/components/player/TransportControls.tsx
- musicode-ui/src/components/player/ProgressBar.tsx
- musicode-ui/src/components/player/VolumeControl.tsx
- musicode-ui/src/components/player/CrossfadePopover.tsx
- musicode-ui/src/components/player/EqPopover.tsx
