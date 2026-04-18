---
id: T01
parent: S01
milestone: M009
key_files:
  - musicode-ui/src/audio/audioGraph.ts
key_decisions:
  - Volume controlled exclusively via GainNode.gain.value — HTMLAudioElement.volume fixed at 1.0
  - Module-level singletons (not React state) because createMediaElementSource can only be called once per element
  - Callback-based event wiring instead of direct addEventListener — consumers register via setOnTimeUpdate/setOnEnded/setOnLoadedMetadata
  - stop() method added for logout use case (not in original plan)
duration: 
verification_result: passed
completed_at: 2026-04-18T08:39:36.263Z
blocker_discovered: false
---

# T01: Created centralized audioGraph.ts module encapsulating the entire Web Audio API pipeline

**Created centralized audioGraph.ts module encapsulating the entire Web Audio API pipeline**

## What Happened

Created `musicode-ui/src/audio/audioGraph.ts` — a module-level singleton that owns the complete audio graph: `HTMLAudioElement → MediaElementSourceNode → GainNode → [insert chain] → AnalyserNode → destination`. The module exposes a clean API surface: `init()` (lazy AudioContext creation on user gesture), `setSource/play/pause/stop/seek`, `setVolume` (via GainNode, element stays at 1.0), `getAnalyser()` for visualizer, and callback registration for timeupdate/ended/loadedmetadata. Includes `pendingVolume` mechanism for pre-init volume calls. Insert chain slot documented for M010 EQ/crossfade nodes. `stop()` method added for logout cleanup.

## Verification

TypeScript compiles clean (`npx tsc --noEmit`). Module exports verified. Graph initialization confirmed in browser — console shows `[audioGraph] Graph initialized: source → gain → analyser → destination` on first play gesture.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 8000ms |
| 2 | `Browser: console.log '[audioGraph] Graph initialized' on first play` | 0 | pass | 0ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/audio/audioGraph.ts`
