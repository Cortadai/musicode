# S02: Frontend — Canvas waveform + seek integration

**Goal:** Canvas-based waveform component that fetches peaks from API, renders bars, handles seek interaction, integrates into PlayerBar and NowPlayingOverlay
**Demo:** After this: user sees waveform in progress bar area, can click to seek, played portion highlighted

## Must-Haves

- Waveform visible in both player locations, seek works, fallback shown during loading

## Proof Level

- This slice proves: final-assembly

## Integration Closure

WaveformBar replaces range input in ProgressBar, wired into both PlayerBar and NowPlayingOverlay

## Verification

- None — frontend rendering only

## Tasks

- [x] **T01: WaveformBar canvas component + API hook** `est:2h`
  Create WaveformBar React component using HTML5 Canvas. Renders ~200 bars: played portion in accent color, unplayed in muted color. Supports click-to-seek and drag-to-seek. Create useWaveform hook that fetches GET /api/waveforms/{trackId} and caches in state. Returns peaks array + loading state.
  - Files: `musicode-frontend/src/components/WaveformBar.tsx`, `musicode-frontend/src/api/waveforms.ts`, `musicode-frontend/src/hooks/useWaveform.ts`
  - Verify: npx tsc --noEmit

- [x] **T02: ProgressBar integration — swap range input for WaveformBar with fallback** `est:1.5h`
  Replace the existing range input in ProgressBar with WaveformBar when peaks are available. Show current flat progress bar as fallback while waveform loads or if no peaks returned. Pass currentTime, duration, and onSeek props through. Ensure time display still works.
  - Files: `musicode-frontend/src/components/ProgressBar.tsx`, `musicode-frontend/src/components/PlayerBar.tsx`
  - Verify: npx tsc --noEmit

- [x] **T03: NowPlayingOverlay + PlayerBar final integration** `est:1h`
  Ensure waveform displays correctly in both PlayerBar (bottom bar) and NowPlayingOverlay (fullscreen). Handle sizing differences: PlayerBar is narrow/wide, Overlay may have different dimensions. Verify seek works in both contexts. Visual polish: bar width, spacing, colors consistent with existing theme.
  - Files: `musicode-frontend/src/components/NowPlayingOverlay.tsx`, `musicode-frontend/src/components/PlayerBar.tsx`
  - Verify: npx tsc --noEmit && echo 'Visual verification required in browser'

## Files Likely Touched

- musicode-frontend/src/components/WaveformBar.tsx
- musicode-frontend/src/api/waveforms.ts
- musicode-frontend/src/hooks/useWaveform.ts
- musicode-frontend/src/components/ProgressBar.tsx
- musicode-frontend/src/components/PlayerBar.tsx
- musicode-frontend/src/components/NowPlayingOverlay.tsx
