---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Replace div sliders with native range inputs in ProgressBar and VolumeControl

ProgressBar and VolumeControl use div+onClick for seek/volume — not focusable, not keyboard accessible. Replace with native <input type='range'> elements with proper ARIA labels (aria-label, aria-valuemin, aria-valuemax, aria-valuenow). Style to match current design using CSS appearance:none + custom track/thumb. Mute button gets aria-label that reflects muted/unmuted state.

## Inputs

- `musicode-ui/src/components/player/ProgressBar.tsx`
- `musicode-ui/src/components/player/VolumeControl.tsx`

## Expected Output

- `musicode-ui/src/components/player/ProgressBar.tsx`
- `musicode-ui/src/components/player/VolumeControl.tsx`

## Verification

Tab focuses both sliders. Arrow keys adjust values. Screen reader announces 'Seek position' and 'Volume' with current values.
