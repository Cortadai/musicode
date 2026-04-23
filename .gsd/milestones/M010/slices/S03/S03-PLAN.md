# S03: Visualizer expandible con 3 modos

**Goal:** Expandable visualizer panel with 3 drawing modes (bars, waveform, circular), CSS Grid animation, mode persistence, and smooth fade-out on pause/stop.
**Demo:** User clicks visualizer toggle — panel expands with CSS animation. User switches between bars, waveform, and spectrogram modes. Panel collapses with reverse animation.

## Must-Haves

- User clicks visualizer toggle — panel expands with smooth CSS animation. User switches between bars, waveform, and circular modes. Mode persists across F5. Visualizer fades out smoothly when playback pauses or stops.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Visualizer 3 modes + expand/collapse animation** `est:45m`
  Rewrite Visualizer.tsx with 3 drawing modes: bars (frequency spectrum), waveform (time-domain with glow and smoothing), circular (64 frequency bars in radial layout). CSS Grid animation for expand/collapse (grid-template-rows 0fr→1fr + opacity). Mode selector overlay with icons.
  - Files: `musicode-ui/src/components/player/Visualizer.tsx`, `musicode-ui/src/components/player/PlayerBar.tsx`, `musicode-ui/src/index.css`
  - Verify: Build succeeds. Visual inspection: 3 modes render, expand/collapse animates smoothly.

- [x] **T02: Visualizer mode persistence in localStorage** `est:10m`
  Add visualizerMode field to AudioPreferences. Validate on load, default to 'bars'. Persist on mode change.
  - Files: `musicode-ui/src/audio/audioPreferences.ts`
  - Verify: Build succeeds. Mode survives F5.

- [x] **T03: Smooth fade-out on pause/stop** `est:15m`
  Add decay tracking — when audio stops, overlay semi-transparent black layers each frame until canvas is clear. Reset waveform smoothing buffer on full decay. Works for all 3 modes.
  - Files: `musicode-ui/src/components/player/Visualizer.tsx`
  - Verify: Build succeeds. Pause or stop playback — visualizer fades out smoothly instead of freezing.

## Files Likely Touched

- musicode-ui/src/components/player/Visualizer.tsx
- musicode-ui/src/components/player/PlayerBar.tsx
- musicode-ui/src/index.css
- musicode-ui/src/audio/audioPreferences.ts
