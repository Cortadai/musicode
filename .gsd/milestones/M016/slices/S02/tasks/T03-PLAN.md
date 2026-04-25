---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: NowPlayingOverlay + PlayerBar final integration

Ensure waveform displays correctly in both PlayerBar (bottom bar) and NowPlayingOverlay (fullscreen). Handle sizing differences: PlayerBar is narrow/wide, Overlay may have different dimensions. Verify seek works in both contexts. Visual polish: bar width, spacing, colors consistent with existing theme.

## Inputs

- `musicode-frontend/src/components/WaveformBar.tsx`
- `musicode-frontend/src/components/NowPlayingOverlay.tsx`
- `musicode-frontend/src/components/PlayerBar.tsx`

## Expected Output

- `musicode-frontend/src/components/NowPlayingOverlay.tsx`
- `musicode-frontend/src/components/PlayerBar.tsx`

## Verification

npx tsc --noEmit && echo 'Visual verification required in browser'
