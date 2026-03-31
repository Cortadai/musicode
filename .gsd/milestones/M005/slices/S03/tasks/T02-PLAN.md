---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: Visualizer Canvas component

Create components/player/Visualizer.tsx — Canvas 2D component that renders frequency bars. Uses useAudioAnalyser() to get the AnalyserNode. On each requestAnimationFrame: getByteFrequencyData() into Uint8Array, draw bars on canvas with indigo gradient. Pauses animation when isPlaying=false or document is hidden (Page Visibility API). Accepts visible prop to show/hide. Bars should be responsive to canvas width. Style: indigo bars with slight transparency, matching the app theme.

## Inputs

- `useAudioAnalyser from T01`

## Expected Output

- `components/player/Visualizer.tsx`

## Verification

npm run build compiles
