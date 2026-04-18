# M009: Audio Pipeline & Gapless

## Vision
Transform Musicode's audio playback from dispersed singletons (globalAudio, audioContext, analyserNode) into a centralized extensible audio graph with dual-element gapless playback and localStorage preference persistence. Zero user-visible regressions — the player sounds and works exactly as before, but the internals are ready for crossfade, EQ, and effects.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | high | — | ✅ | El reproductor funciona exactamente igual que antes — play, pause, seek, volume, visualizador, Media Session, scrobbling — pero internamente todo pasa por el graph extensible (audioGraph.ts). Volumen controlado via GainNode. |
| S02 | S02 | low | — | ✅ | Recarga la pagina: el volumen, shuffle y repeat se mantienen. Antes se perdian. Borra localStorage: el player arranca con defaults sanos. |
| S03 | S03 | medium | — | ✅ | Reproduce un album completo: las transiciones entre tracks no tienen silencio perceptible. Skip manual funciona normal. |
