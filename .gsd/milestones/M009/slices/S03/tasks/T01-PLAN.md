---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Dual-element audioGraph

Refactor audioGraph.ts to manage two HTMLAudioElements (A/B). Both get a MediaElementSourceNode connected to the shared gainNode→analyserNode→destination chain. Only one source is connected at a time — the inactive one pre-loads silently. Add: prepareNext(src), swap(), stop() cleanup for both, connect/disconnect source helpers. Keep the public API backward-compatible so usePlayer changes are minimal.

## Inputs

- `Current audioGraph.ts single-element architecture`

## Expected Output

- `audioGraph.ts with dual-element support, prepareNext(), swap(), updated stop()`

## Verification

TypeScript compiles clean. Manual: play a track, call prepareNext() from console, verify no audio glitch on active track.
