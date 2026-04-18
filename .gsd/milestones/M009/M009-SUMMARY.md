---
id: M009
title: "Audio Pipeline & Gapless"
status: complete
completed_at: 2026-04-18T09:49:53.755Z
key_decisions:
  - Hybrid streaming approach: keep HTMLAudioElement for HTTP Range streaming, use Web Audio API only for processing (gain, analyser). Full AudioBuffer decode impractical for FLAC (100-500MB+ per buffer).
  - Near-gapless (dual-element swap, ~0-50ms) over sample-accurate (MSE/full AudioBuffer) — much simpler, good enough for the use case.
  - Gapless always-on, no toggle — universally better, no downside.
  - localStorage for preference persistence over backend — simpler, device-local is fine for audio prefs.
  - createMediaElementSource called once per element at graph init — browser constraint, not a choice.
key_files:
  - musicode-ui/src/audio/audioGraph.ts
  - musicode-ui/src/hooks/usePlayer.ts
  - musicode-ui/src/hooks/useAudioAnalyser.ts
  - musicode-ui/src/context/PlayerContext.tsx
lessons_learned:
  - audioGraph.play() must call init() — any code path that triggers playback needs to ensure the graph exists first, otherwise audio bypasses the Web Audio pipeline entirely
  - createMediaElementSource can only be called once per HTMLAudioElement — plan dual-element from the start if gapless is in scope
  - Pre-load threshold of 3s works well for gapless — long enough to buffer, short enough to not waste bandwidth on skipped tracks
---

# M009: Audio Pipeline & Gapless

**Migrated audio playback to a centralized extensible Web Audio graph with dual-element gapless transitions and localStorage preference persistence**

## What Happened

M009 transformed Musicode's audio architecture from dispersed singletons (globalAudio, audioContext, analyserNode scattered across hooks) into a centralized audioGraph module with a clean public API. The work was delivered in three slices:

**S01 — AudioGraph centralizado:** Created musicode-ui/src/audio/audioGraph.ts as a singleton managing the full Web Audio pipeline (HTMLAudioElement → MediaElementSourceNode → GainNode → AnalyserNode → destination). Refactored usePlayer.ts to delegate all audio operations to the graph. Volume control moved from HTMLAudioElement.volume to GainNode.gain for future crossfade/EQ extensibility.

**S02 — Persistencia de preferencias:** Added localStorage persistence for volume, shuffle, and repeatMode. Discovered and fixed a bug where audioGraph.play() wasn't calling init(), causing audio to bypass the graph when the first user gesture was clicking a track in the list (not play/pause button). This left volume/mute non-functional until the graph was initialized by another path.

**S03 — Gapless playback:** Extended the graph to dual HTMLAudioElement architecture (A/B slots). At ~3s before track end, the next track pre-loads on the inactive element. On the ended event, active element swaps and playback continues with near-zero gap. All edge cases handled: manual skip cancels pre-load, repeat-one restarts without swap, repeat-all wraps with gapless, repeat-off stops, logout cleans up both elements. Visualizer and volume persist across swaps.

The architecture is ready for M010 (crossfade, EQ, visualizer enhancements) — new AudioNodes can be inserted into the graph chain without structural changes.

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

Original M009 scope included crossfade, EQ, and visualizer. These were split into M010 during planning — validate pipeline architecture before extending it. No deviations within the reduced M009 scope.

## Follow-ups

M010: Crossfade (opt-in, 0-12s slider), EQ (opt-in, flat default), Visualizer mode selector (current bars as default). All build on the stable graph established here.
