# M009: Audio Pipeline & Gapless

**Gathered:** 2026-04-18
**Status:** Ready for planning

## Project Description

Transform Musicode's audio playback from a bare HTMLAudioElement with an AudioContext bolted on for visualization, to a centralized extensible audio graph that supports gapless playback and prepares insertion points for future audiophile features (crossfade, EQ, effects).

## Why This Milestone

The current audio architecture has dispersed singletons (`globalAudio` in `usePlayer.ts`, `audioContext`/`analyserNode` in `useAudioAnalyser.ts`) that don't coordinate. Volume is controlled via `globalAudio.volume` (bypasses the AudioContext graph), and there's no way to insert processing nodes into the audio path. This is the foundation everything else depends on -- without a proper graph, crossfade, EQ, and effects can't exist.

Gapless playback is table stakes for any serious music player. Silence between consecutive tracks breaks the listening experience, especially on live albums and continuous mixes.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Play music exactly as before (zero regression) with volume now routed through the AudioContext graph
- Listen to a full album where track transitions have no perceptible silence
- Reload the page and find volume, shuffle, and repeat settings preserved

### Entry point / environment

- Entry point: http://localhost:5173 (Vite dev) or http://localhost:8080 (Docker)
- Environment: browser (Chrome/Edge/Firefox)
- Live dependencies involved: none (all frontend, backend unchanged)

## Completion Class

- Contract complete means: unit tests pass for audioGraph module logic, localStorage persistence, and gapless timing calculations
- Integration complete means: the player works end-to-end in a real browser with real FLAC files -- play, pause, seek, volume, queue, shuffle, repeat, visualizer, Media Session, scrobbling all function identically
- Operational complete means: none (no server-side changes)

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- Play a FLAC album end-to-end: all tracks transition without perceptible silence
- Reload the page mid-album: volume and shuffle/repeat settings are restored
- All existing player features (seek, next/prev, queue manipulation, visualizer toggle, Media Session keys, scrobbling at 50% threshold) work identically to pre-M009 behavior

## Architectural Decisions

### Centralized AudioGraph module (D026)

**Decision:** Consolidate all audio singletons into a single `audioGraph.ts` module encapsulating: dual HTMLAudioElement -> createMediaElementSource -> GainNode -> [insert chain] -> AnalyserNode -> destination.

**Rationale:** Current code has globalAudio in usePlayer.ts and audioContext/analyserNode in useAudioAnalyser.ts -- they don't coordinate. A single module gives one point for inserting/removing nodes. Hooks consume this module instead of managing their own singletons.

**Alternatives Considered:**
- Extend current separated singletons -- would require coordinating between unrelated modules, gets worse with each new feature

### Gapless via dual HTMLAudioElement (D027)

**Decision:** Two HTMLAudioElement instances, each with its own `createMediaElementSource` connected to the graph. Pre-load next track on the second element, swap at track end. Near-gapless timing (~0-50ms).

**Rationale:** Simpler than buffer puente (partial fetch + decodeAudioData). No memory problem -- `decodeAudioData` decompresses FLAC to 32-bit float PCM (~101 MB per 5-minute stereo 44.1kHz track, 200-500MB for typical FLACs). Dual element keeps streaming via native HTMLAudioElement.

**Alternatives Considered:**
- Buffer bridge (partial decode) -- more precise but complex memory management with large FLACs
- Full AudioBuffer decode -- impractical, ~101MB+ RAM per track
- MediaSource Extensions -- overkill complexity for near-gapless

### Audio preferences in localStorage (D028)

**Decision:** Store volume, shuffle, repeat (and future EQ/crossfade) in localStorage.

**Rationale:** Device-local, simple, no backend changes. For a personal project, cross-device sync is not needed. Can migrate to User entity later if desired.

**Alternatives Considered:**
- Backend persistence in User entity -- more complex, unnecessary for single-device use

## Error Handling Strategy

**Core principle: "El audio nunca debe dejar de sonar por un error en una feature secundaria."**

- AudioContext blocked by browser: already handled (resume on user gesture). Maintain existing pattern.
- Gapless pre-load failure: fallback silencioso -- no gapless on that transition, next track starts normally. Console log, no user-visible error.
- Decode error on a track: discreet notification (toast), auto-skip to next track if queue exists.
- Invalid localStorage values: reset to defaults (volume 1.0, shuffle off, repeat off) silently.
- Visualizer failure (canvas context lost): panel hides cleanly. Playback unaffected.

Every secondary feature wraps its initialization and runtime in try/catch that logs and degrades. The primary audio path (HTMLAudioElement -> play/pause/seek) is never gated on secondary feature success.

## Risks and Unknowns

- `createMediaElementSource` can only be called once per HTMLAudioElement -- the dual-element approach requires creating both source nodes at graph initialization time, not lazily
- Browser differences in `ended` event timing vs actual audio output end -- may need fine-tuning for gapless swap precision
- Existing code in `usePlayer.ts` is tightly coupled to `globalAudio` singleton (direct `.src`, `.play()`, `.pause()`, `.currentTime`, `.volume` access) -- migration must be surgical

## Existing Codebase / Prior Art

- `musicode-ui/src/hooks/usePlayer.ts` -- PlayerContext with useReducer, 11 action types, globalAudio singleton, Media Session integration, scrobble threshold tracking
- `musicode-ui/src/hooks/useAudioAnalyser.ts` -- AudioContext + AnalyserNode singletons, createMediaElementSource, lazy init on user gesture
- `musicode-ui/src/components/Visualizer.tsx` -- Canvas 2D frequency bars, 60fps, Page Visibility awareness
- `musicode-ui/src/components/PlayerBar.tsx` -- volume slider reads/writes globalAudio.volume directly
- `musicode-ui/src/components/VinylPlayer.tsx` -- vinyl animation, also reads globalAudio for rotation

## Relevant Requirements

- R017 -- extensible audio graph pipeline (primary deliverable)
- R018 -- near-gapless playback (primary deliverable)
- R019 -- audio preferences persistence in localStorage (primary deliverable)
- R020 -- silent degradation for secondary features (cross-cutting)
- R005 -- validated: existing playback must not regress

## Scope

### In Scope

- Centralized audioGraph.ts module with full Web Audio API graph
- Dual HTMLAudioElement for gapless
- GainNode-based volume control (replacing globalAudio.volume)
- Insert chain points for future EQ/crossfade nodes
- localStorage persistence for volume, shuffle, repeat
- Existing visualizer continues working via the new graph's AnalyserNode
- All existing player features maintain identical behavior

### Out of Scope / Non-Goals

- Crossfade (M010)
- EQ (M010)
- Enhanced visualizer modes (M010)
- Backend changes of any kind
- Sample-accurate gapless (MSE/full decode)
- Cross-device preference sync

## Technical Constraints

- HTMLAudioElement must remain the streaming engine (memory constraint with decoded PCM)
- createMediaElementSource can only be called once per element -- plan element lifecycle carefully
- AudioContext requires user gesture to resume (already handled, must not regress)
- Two simultaneous MediaElementSourceNodes may have browser-specific behavior to verify

## Integration Points

- usePlayer.ts -- must consume audioGraph instead of globalAudio directly
- useAudioAnalyser.ts -- replaced by audioGraph's built-in AnalyserNode
- PlayerBar.tsx -- volume control wires to audioGraph.setVolume() instead of globalAudio.volume
- VinylPlayer.tsx -- reads audio state from audioGraph
- Visualizer.tsx -- gets AnalyserNode from audioGraph instead of useAudioAnalyser
- Media Session API -- stays in usePlayer, but play/pause/seek delegates to audioGraph
- Scrobble threshold (50% tracking) -- stays in usePlayer, reads currentTime from audioGraph

## Testing Requirements

- Unit tests for audioGraph module: graph initialization, volume control, source switching, insert chain management
- Unit tests for localStorage persistence: save/load/defaults/corruption recovery
- Unit tests for gapless timing logic: pre-load trigger, swap coordination
- Manual/Playwright verification: play full album, seek, volume, shuffle, repeat, visualizer, Media Session keys, scrobbling
- Web Audio API nodes (AudioContext, GainNode, AnalyserNode) don't exist in jsdom -- pure logic tests only, real behavior verified in browser

## Acceptance Criteria

### S01 (AudioGraph centralizado)
- Player works identically to current behavior: play, pause, seek, next/prev, volume, visualizer
- Volume controlled via GainNode (verifiable: disconnecting GainNode silences audio)
- audioGraph module exports insertion points for future nodes
- Zero console errors during normal playback

### S02 (Persistencia localStorage)
- Reload page: volume, shuffle, repeat preserved
- Clear localStorage: player starts with sane defaults (volume 1.0, shuffle off, repeat off)
- Corrupt localStorage values: player recovers gracefully

### S03 (Gapless playback)
- Play album: transitions between consecutive tracks have no perceptible silence
- Skip to next track manually: works normally (gapless is for natural end-of-track transitions)
- Gapless pre-load failure: next track plays normally with standard transition

## Open Questions

- Exact `ended` event timing on FLAC files across Chrome/Edge/Firefox -- may need empirical testing to calibrate swap timing
- Whether two MediaElementSourceNodes can coexist on the same AudioContext without issues -- needs verification in S01
