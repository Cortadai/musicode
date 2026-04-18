# S01: AudioGraph centralizado

**Goal:** Consolidar los singletons de audio dispersos (globalAudio, audioContext, analyserNode) en un módulo centralizado audioGraph.ts que encapsula el graph completo: HTMLAudioElement → createMediaElementSource → GainNode → [insert chain] → AnalyserNode → destination. El reproductor funciona exactamente igual que antes desde la perspectiva del usuario, pero internamente todo pasa por el graph extensible. Volumen controlado vía GainNode.
**Demo:** El reproductor funciona exactamente igual que antes — play, pause, seek, volume, visualizador, Media Session, scrobbling — pero internamente todo pasa por el graph extensible (audioGraph.ts). Volumen controlado via GainNode.

## Must-Haves

- Player works identically: play, pause, seek, next/prev, volume, visualizer, Media Session, scrobbling
- Volume controlled via GainNode (HTMLAudioElement.volume stays at 1.0)
- audioGraph module exports insertion points for future nodes (EQ, crossfade)
- useAudioAnalyser.ts eliminated — analyser comes from audioGraph
- Zero console errors during normal playback
- globalAudio no longer exported from usePlayer

## Proof Level

- This slice proves: behavioral — verified in browser with real FLAC files

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Create audioGraph.ts module** `est:45min`
  Create the centralized audio graph module as a singleton. Encapsulates: one HTMLAudioElement, AudioContext (lazy init on user gesture), createMediaElementSource, GainNode for volume, AnalyserNode for visualizer, and destination. Exports API: init(), play(src), pause(), resume(), seek(time), setVolume(0-1), getAnalyser(), getCurrentTime(), getDuration(), setSource(src), onTimeUpdate/onEnded/onLoadedMetadata callbacks. HTMLAudioElement.volume stays at 1.0 — volume is controlled exclusively via GainNode. Prepares a slot/comments for future insert chain (EQ, crossfade second source) but does not implement them yet.
  - Files: `musicode-ui/src/audio/audioGraph.ts`
  - Verify: Module compiles. Unit test or manual verification that init() creates the graph, setVolume changes GainNode.gain.value, getAnalyser returns a valid AnalyserNode.

- [x] **T02: Migrate usePlayer.ts and eliminate useAudioAnalyser.ts** `est:40min`
  Refactor usePlayer.ts to delegate all audio operations to audioGraph instead of accessing globalAudio directly. Remove the globalAudio export. Replace globalAudio.src/load/play/pause/currentTime/volume with audioGraph equivalents. Wire event handlers (timeupdate, ended, loadedmetadata) through audioGraph callbacks instead of addEventListener on globalAudio. Media Session seekto uses audioGraph.seek(). Volume sync effect uses audioGraph.setVolume(). Delete useAudioAnalyser.ts entirely — its functionality is absorbed by audioGraph. Create a thin useAudioAnalyser replacement hook or direct import that returns audioGraph.getAnalyser().
  - Files: `musicode-ui/src/hooks/usePlayer.ts`, `musicode-ui/src/hooks/useAudioAnalyser.ts`, `musicode-ui/src/audio/audioGraph.ts`
  - Verify: Build succeeds with no TypeScript errors. No imports of globalAudio or old useAudioAnalyser remain in the codebase. grep confirms elimination.

- [x] **T03: Migrate UI components and verify zero regressions** `est:30min`
  Update PlayerBar.tsx: replace initAudioContext() calls with audioGraph.init(). Update Visualizer.tsx: get analyser from audioGraph instead of useAudioAnalyser hook. Verify in browser: play a track, pause, seek, next/prev, volume slider, shuffle, repeat, visualizer toggle, Media Session keys (play/pause/next/prev via keyboard), scrobble fires at 50%. Check console for errors.
  - Files: `musicode-ui/src/components/player/PlayerBar.tsx`, `musicode-ui/src/components/player/Visualizer.tsx`
  - Verify: Manual browser verification: play FLAC track end-to-end, seek, volume, visualizer, Media Session, next/prev, shuffle, repeat. Zero console errors. Scrobble fires at 50%.

## Files Likely Touched

- musicode-ui/src/audio/audioGraph.ts
- musicode-ui/src/hooks/usePlayer.ts
- musicode-ui/src/hooks/useAudioAnalyser.ts
- musicode-ui/src/components/player/PlayerBar.tsx
- musicode-ui/src/components/player/Visualizer.tsx
