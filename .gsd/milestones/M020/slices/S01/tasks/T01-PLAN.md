---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: AnalyzerDeckDataSource + useFrameScheduler

Create the shared audio data abstraction that wraps AnalyserNode with configurable FFT size (default 4096), providing getFrequencyData() and getTimeDomainData() as Float32Arrays. Create a second AnalyserNode dedicated to the deck (higher FFT size than the existing 256 one). Build useFrameScheduler hook: rAF loop with FPS cap (default 60), gated on playback state from usePlayer, subscriber pattern for multiple scopes sharing one loop.

## Inputs

- `audioGraph.ts (existing AnalyserNode setup)`
- `reference/prism/src/renderer/visualizers/frameScheduler.ts`
- `reference/prism/src/renderer/visualizers/dataSource.ts`

## Expected Output

- `analyzerDeckDataSource.ts with AnalyzerDeckDataSource class`
- `useFrameScheduler.ts hook`

## Verification

Import and call in a test component — verify Float32Array data flows when playing, zeros when paused. Console.log FPS to confirm ~60fps cap.
