---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: ProgressBar integration — swap range input for WaveformBar with fallback

Replace the existing range input in ProgressBar with WaveformBar when peaks are available. Show current flat progress bar as fallback while waveform loads or if no peaks returned. Pass currentTime, duration, and onSeek props through. Ensure time display still works.

## Inputs

- `musicode-frontend/src/components/WaveformBar.tsx`
- `musicode-frontend/src/components/ProgressBar.tsx`

## Expected Output

- `musicode-frontend/src/components/ProgressBar.tsx`

## Verification

npx tsc --noEmit
