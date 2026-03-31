---
id: T01
parent: S03
milestone: M005
provides: []
requires: []
affects: []
key_files: ["musicode-ui/src/hooks/useAudioAnalyser.ts"]
key_decisions: ["Module-level singletons for AudioContext/AnalyserNode/sourceConnected — survives React lifecycle", "fftSize 256 (128 frequency bins) — good balance of resolution and responsiveness", "Polling interval (200ms) for analyser availability — simple, low overhead"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build compiles cleanly."
completed_at: 2026-03-31T11:01:20.097Z
blocker_discovered: false
---

# T01: AudioContext + AnalyserNode hook with lazy init and single-connection guard.

> AudioContext + AnalyserNode hook with lazy init and single-connection guard.

## What Happened
---
id: T01
parent: S03
milestone: M005
key_files:
  - musicode-ui/src/hooks/useAudioAnalyser.ts
key_decisions:
  - Module-level singletons for AudioContext/AnalyserNode/sourceConnected — survives React lifecycle
  - fftSize 256 (128 frequency bins) — good balance of resolution and responsiveness
  - Polling interval (200ms) for analyser availability — simple, low overhead
duration: ""
verification_result: passed
completed_at: 2026-03-31T11:01:20.098Z
blocker_discovered: false
---

# T01: AudioContext + AnalyserNode hook with lazy init and single-connection guard.

**AudioContext + AnalyserNode hook with lazy init and single-connection guard.**

## What Happened

Created useAudioAnalyser hook with lazy AudioContext initialization (deferred to user gesture), guarded createMediaElementSource (called once via module-level flag), and AnalyserNode with fftSize 256. Exported initAudioContext for PlayerBar to call on play/visualizer toggle. Hook polls for analyser availability after external init.

## Verification

npm run build compiles cleanly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 4300ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/hooks/useAudioAnalyser.ts`


## Deviations
None.

## Known Issues
None.
