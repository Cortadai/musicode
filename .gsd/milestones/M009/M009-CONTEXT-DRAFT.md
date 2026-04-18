# M009 & M010: Audio Pipeline — Discussion Draft

**Saved:** 2026-04-18
**Status:** In discussion — Layer 3 confirmed, Layer 4 pending

## Milestone Split (Confirmed)

- **M009: Audio Pipeline & Gapless** — migrar a graph extensible + gapless playback
- **M010: Audio Experience** — crossfade, EQ paramétrico, visualizador mejorado

## Scope — M009

- Migrar singleton audio a graph extensible: HTMLAudioElement → createMediaElementSource → GainNode → [insert chain] → AnalyserNode → destination
- Gapless near-gapless con dual HTMLAudioElement y swap (no buffer puente)
- Volumen controlado vía GainNode (no globalAudio.volume)
- Preferencias en localStorage
- Gapless siempre activo, sin toggle

## Scope — M010

- Crossfade opt-in (slider 0-12s, default off)
- EQ paramétrico opt-in, 5 bandas (60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz), BiquadFilterNodes, presets, default off/flat
- Visualizador 3 modos (barras actuales + waveform + espectrograma), panel expandible, transición suave
- Selector de modo persistido en localStorage

## Diferido a milestone futuro

- Fullscreen/overlay "Now Playing" (estilo Spotify)
- Adaptación de color del visualizador a la portada del álbum
- Visualización circular/radial

## Arquitectura (Confirmed)

- AudioGraph centralizado en `audioGraph.ts` — módulo singleton, único punto de inserción/remoción de nodos
- Hooks consumen audioGraph.ts, no manejan singletons propios
- Dual HTMLAudioElement para gapless (swap en momento justo, cada uno con su createMediaElementSource)
- EQ 5 bandas con BiquadFilterNode en serie
- Preferencias en localStorage

## Error Handling (Confirmed)

- Regla de oro: el audio nunca deja de sonar por un error en una feature secundaria
- Degradación silenciosa en gapless, EQ, crossfade, visualizador
- AudioContext bloqueado: resume on user gesture (ya manejado)
- Fallo pre-carga segundo element: fallback a transición normal, log a consola
- Decode error: toast + skip al siguiente track
- localStorage corrupto: reset a defaults silencioso
- Canvas/visualizador falla: panel se oculta, reproducción no afectada

## Filosofía

- "Menos es más" — cambios incrementales, cómodos para el código existente
- "Tu audio suena exactamente como antes hasta que tú decidas cambiarlo"
- Gapless siempre on, todo lo demás opt-in con defaults conservadores

## Open Questions (Layer 4 pending)

- Acceptance criteria por slice
- Test strategy
- Definition of done
