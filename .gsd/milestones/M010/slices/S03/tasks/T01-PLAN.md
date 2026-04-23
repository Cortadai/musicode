---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: Visualizer 3 modes + expand/collapse animation

Rewrite Visualizer.tsx with 3 drawing modes: bars (frequency spectrum), waveform (time-domain with glow and smoothing), circular (64 frequency bars in radial layout). CSS Grid animation for expand/collapse (grid-template-rows 0fr→1fr + opacity). Mode selector overlay with icons.

## Inputs

- `analyserNode from audioGraph`

## Expected Output

- `Visualizer with bars/waveform/circular modes`
- `CSS Grid expand/collapse animation`

## Verification

Build succeeds. Visual inspection: 3 modes render, expand/collapse animates smoothly.
