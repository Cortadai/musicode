# Handover — 18 abril 2026

## Resumen de sesión

Planificación y ejecución completa de **M009: Audio Pipeline & Gapless**. Tres slices entregados y verificados.

### Lo que se hizo

1. **S01 — AudioGraph centralizado**: Migración del audio pipeline disperso (singletons en `usePlayer.ts` y `useAudioAnalyser.ts`) a un módulo centralizado `audioGraph.ts` que encapsula toda la cadena Web Audio API: `source → GainNode → AnalyserNode → destination`. Volumen controlado vía `GainNode` (no `HTMLAudioElement.volume`).

2. **S02 — Persistencia de preferencias**: Volume, shuffle y repeat mode se guardan en `localStorage` y se restauran al recargar. Módulo `audioPreferences.ts` con API simple de load/save.

3. **S03 — Gapless playback**: Dual `HTMLAudioElement` (A y B) alternando roles. Pre-carga el siguiente track ~3s antes del final del activo. Swap sin gap audible (~0-50ms). Funciona con repeat-all (último track → primero), skip manual, y logout.

4. **Actualización de documentación**: PROJECT.md, README.md, HANDOVER.md actualizados al estado post-M009.

### Bugs encontrados y corregidos durante M009

- **`play()` no llamaba `init()`**: Si el primer gesto del usuario era clickear un track en la lista (no play/pause ni visualizer), el audio sonaba por el `HTMLAudioElement` sin pasar por el graph. El slider de volumen y mute no funcionaban. Fix: `play()` llama `init()` al inicio.

### Estado del repo

- **Branch**: `main`
- **9 milestones cerrados** (M001–M009)
- **169 tests** pasando (97 backend + 40 frontend + 21 E2E + 11 otros)

---

## Siguiente: M010 — Audio Experience

### Alcance (de PROJECT.md)

- Crossfade opt-in (slider 0-12s, default off)
- Ecualizador paramétrico 5 bandas (opt-in, default flat)
- Visualizador mejorado (3 modos + panel expandible)

### Arquitectura lista para M010

El audio graph de M009 fue diseñado explícitamente para extensión. Los nuevos nodos se insertan en la cadena entre `GainNode` y `AnalyserNode`:

```
source → GainNode → [EQ chain] → [crossfade gains] → AnalyserNode → destination
```

La decisión D030 ya define las frecuencias del EQ: 60Hz (lowshelf), 230Hz, 910Hz, 3.6kHz (peaking), 14kHz (highshelf).

### Decisiones relevantes ya tomadas

| # | Decisión |
|---|----------|
| D025 | Split M009/M010 — pipeline primero, experiencia después |
| D026 | AudioGraph centralizado en `audioGraph.ts` |
| D027 | Gapless con dual HTMLAudioElement |
| D028 | localStorage para preferencias de audio |
| D029 | Gapless always-on, crossfade/EQ opt-in |
| D030 | EQ 5 bandas con frecuencias específicas |

### Archivos clave

- `musicode-ui/src/audio/audioGraph.ts` — pipeline centralizado, dual-element, insert chain
- `musicode-ui/src/audio/audioPreferences.ts` — persistencia en localStorage
- `musicode-ui/src/hooks/usePlayer.ts` — lógica de playback, gapless pre-load/swap
- `musicode-ui/src/hooks/useAudioAnalyser.ts` — wrapper del AnalyserNode para visualizer
- `musicode-ui/src/context/PlayerContext.tsx` — estado del player (useReducer)

### Para retomar

```
1. Leer este handover
2. /gsd → planificar M010 con 3 slices (crossfade, EQ, visualizer)
3. Empezar por crossfade — usa el dual-element de gapless
```

---

*No hay work-in-progress ni branches pendientes. Repo limpio.*
