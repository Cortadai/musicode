---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Refactor audioGraph to per-source gain nodes

Restructure the audio graph from single-gain to dual-gain topology. Current: sourceA/B → gainNode → analyser → dest. New: sourceA → gainA, sourceB → gainB, both → masterGain → analyser → dest. gainA/gainB start at 1.0 (active) and 0.0 (inactive). masterGain handles user volume (replaces current gainNode). Update setVolume() to target masterGain. Update swap() to set gain values (swap gainA/gainB levels). All existing behavior (play, pause, stop, seek, volume, mute) must work identically.

## Inputs

- `Current audioGraph.ts with single gainNode topology`

## Expected Output

- `audioGraph.ts with gainA, gainB, masterGain nodes`
- `setVolume targeting masterGain`
- `swap() managing gainA/gainB levels`
- `All existing public API unchanged`

## Verification

npm run build compiles clean. Play a track — volume slider and mute work. Console shows '[audioGraph] Graph initialized: dual-element' log.
