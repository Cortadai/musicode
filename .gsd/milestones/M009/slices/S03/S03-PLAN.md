# S03: Gapless playback

**Goal:** Near-gapless playback via dual HTMLAudioElement architecture — pre-load next track in a secondary element, swap on ended event, ~0-50ms transition gap
**Demo:** Reproduce un album completo: las transiciones entre tracks no tienen silencio perceptible. Skip manual funciona normal.

## Must-Haves

- 1. Two consecutive album tracks play without audible gap (≤50ms silence). 2. Skip next/prev works correctly with dual elements. 3. Repeat modes (off/all/one) work correctly. 4. Logout/stop cleans up both elements. 5. Volume/mute applies to whichever element is active. 6. Visualizer analyser stays connected to active source. 7. No regression in Media Session, scrobble tracking, or play reporting.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Dual-element audioGraph** `est:1h`
  Refactor audioGraph.ts to manage two HTMLAudioElements (A/B). Both get a MediaElementSourceNode connected to the shared gainNode→analyserNode→destination chain. Only one source is connected at a time — the inactive one pre-loads silently. Add: prepareNext(src), swap(), stop() cleanup for both, connect/disconnect source helpers. Keep the public API backward-compatible so usePlayer changes are minimal.
  - Files: `musicode-ui/src/audio/audioGraph.ts`
  - Verify: TypeScript compiles clean. Manual: play a track, call prepareNext() from console, verify no audio glitch on active track.

- [x] **T02: Pre-load and swap logic in usePlayer** `est:1.5h`
  Wire gapless transitions in usePlayer.ts: 1) On timeupdate, when remaining time ≤3s, call audioGraph.prepareNext() with the next track URL (respecting queue, shuffle, repeat). 2) On ended event, call audioGraph.swap() then dispatch NEXT to update React state. 3) Handle edge cases: queue end (no next track), repeat-one (restart same track, no swap), repeat-all (wrap to queue[0]). 4) Manual skip (next/prev) must cancel any pending pre-load and load the target track directly.
  - Files: `musicode-ui/src/hooks/usePlayer.ts`, `musicode-ui/src/context/PlayerContext.tsx`
  - Verify: TypeScript compiles clean. Manual: play album, verify gapless transition between tracks. Test skip, repeat modes, queue end.

- [x] **T03: Edge cases, cleanup, and browser verification** `est:45m`
  1) Logout: audioGraph.stop() must pause and reset both elements. 2) STOP action: same cleanup. 3) Seek near end: if user seeks past the pre-load threshold, trigger prepareNext. 4) Rapid skip: multiple fast next clicks must not leave orphan pre-loads. 5) Browser verification of all scenarios in running app.
  - Files: `musicode-ui/src/audio/audioGraph.ts`, `musicode-ui/src/hooks/usePlayer.ts`
  - Verify: Manual browser test: album gapless transition, skip rapid, repeat-one, repeat-all, queue end stop, logout cuts audio, volume/mute on active element, visualizer stays connected.

## Files Likely Touched

- musicode-ui/src/audio/audioGraph.ts
- musicode-ui/src/hooks/usePlayer.ts
- musicode-ui/src/context/PlayerContext.tsx
