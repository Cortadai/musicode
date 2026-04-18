---
id: S01
parent: M009
milestone: M009
provides:
  - ["audioGraph module with extensible node chain", "GainNode volume control", "AnalyserNode accessible via audioGraph.getAnalyser()", "Insert chain slot for M010 EQ/crossfade"]
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/audio/audioGraph.ts", "musicode-ui/src/hooks/usePlayer.ts", "musicode-ui/src/hooks/useAudioAnalyser.ts"]
key_decisions:
  - ["Volume via GainNode exclusively — HTMLAudioElement.volume fixed at 1.0", "Module-level singletons (not React state) — createMediaElementSource can only be called once per element", "useAudioAnalyser.ts kept as thin wrapper, full removal deferred to M010", "audioGraph.stop() added for logout cleanup (not in original plan, discovered during testing)"]
patterns_established:
  - ["Centralized audio graph module pattern — all audio operations go through audioGraph.*", "Callback registration pattern for event wiring (setOnTimeUpdate, setOnEnded, setOnLoadedMetadata)", "Insert chain architecture — future nodes (EQ, crossfade) connect between GainNode and AnalyserNode"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-18T08:40:29.438Z
blocker_discovered: false
---

# S01: AudioGraph centralizado

**Consolidated scattered audio singletons into a centralized audioGraph.ts module with extensible Web Audio API pipeline**

## What Happened

Migrated the audio architecture from scattered singletons (`globalAudio` in usePlayer.ts, `audioContext`/`analyserNode` in useAudioAnalyser.ts) to a centralized `audioGraph.ts` module that owns the complete Web Audio API pipeline: `HTMLAudioElement → MediaElementSourceNode → GainNode → [insert chain] → AnalyserNode → destination`. Volume is now controlled exclusively via GainNode (element stays at 1.0). The insert chain slot between GainNode and AnalyserNode is prepared for M010 EQ/crossfade nodes. `usePlayer.ts` delegates all audio operations to audioGraph. `useAudioAnalyser.ts` reduced to a thin wrapper (marked for removal in M010). PlayerBar.tsx and Visualizer.tsx required no changes — the hook abstraction absorbed the migration. Added `audioGraph.stop()` for logout cleanup. Zero regressions confirmed by user manual testing.

## Verification

User manual browser verification: play FLAC tracks, pause/resume, seek, volume slider, next/prev, shuffle, repeat, visualizer toggle, Media Session keys, logout stops music. Console: zero errors, `[audioGraph] Graph initialized` log confirmed. TypeScript compiles clean. No imports of old `globalAudio` remain.

## Requirements Advanced

- R017 — Extensible audio graph pipeline implemented with insert chain slot between GainNode and AnalyserNode
- R020 — Graph init is resilient — safe to call multiple times, resumes suspended context

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

Fix cover art duplication bug in CoverArtService (backend, separate from M009)

## Files Created/Modified

- `musicode-ui/src/audio/audioGraph.ts` — New centralized audio graph module (223 lines)
- `musicode-ui/src/hooks/usePlayer.ts` — Migrated from globalAudio to audioGraph delegation
- `musicode-ui/src/hooks/useAudioAnalyser.ts` — Reduced to thin wrapper around audioGraph.getAnalyser()
