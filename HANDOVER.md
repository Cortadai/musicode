# Handover — 25 abril 2026

## Resumen

**16 milestones completados** (M001–M014, M016, M018). Proyecto en estado idle — sin milestone activo. Backlog: 2 milestones pendientes, 1 descartado.

### Lo que se hizo en esta sesión (25 abril)

1. **M014 completado** — Library Health Dashboard: panel que detecta problemas de metadata (tracks sin título/artista/álbum, álbumes sin cover, ALBUMARTIST inconsistente). Backend con `LibraryHealthService` + endpoints. Frontend en `/library/health` con cards resumen + tabla filtrable.

2. **M016 completado** — Synchronized Lyrics con LRCLIB.net: letras sincronizadas en NowPlayingOverlay con panel slide-in. Auto-scroll suave, highlight de línea actual. Cache en DB con status tracking.

3. **M018 completado** — Waveform Progress Bar: backend genera ~300 peaks por track con ffmpeg (lazy, on-demand, cacheado a disco). Frontend renderiza waveform en canvas con seek por click/drag. Toggle en PlayerBar y NowPlayingOverlay para alternar entre waveform y barra plana (default = barra plana). Preferencia persiste en localStorage. Player bar se agranda con waveform activo.

---

## Estado del repo

- **Branch**: `main`
- **16 milestones cerrados** (M001–M014, M016, M018)
- **Sin milestone activo**

## Métricas

- **877 tracks** en librería
- **~350+ tests**: backend + frontend
- **21 E2E Playwright**
- **22 requirements validados**, 3 diferidos, 1 out-of-scope

## Backlog priorizado

| Orden | ID | Milestone | Scope | Est. |
|-------|----|-----------|-------|------|
| 1 | M019 | **Graceful Resize** | Que la app no se rompa al reducir ventana (~800-1024px). Sidebar colapsable a iconos por debajo de ~1024px. PlayerBar sin desborde. No es diseño mobile: sin hamburger, sin touch gestures, sin breakpoints portrait. | 1-2 días |
| 2 | M017 | **Cassette Deck Visualizer** | 5º modo del visualizer en NowPlayingOverlay. Carretes girando proporcional al progreso, cinta enrollándose, contador mecánico, label con fuente typewriter. 100% frontend. Opcionalmente filtro de audio tipo cinta (wow & flutter, tape hiss via Web Audio API). Último milestone — puro deleite. | 4-6 días |

**Completados esta sesión:** M014 (Library Health), M016 (Synchronized Lyrics), M018 (Waveform Progress Bar)
**Descartado:** ~~M015 Filesystem Watcher~~

**Estimación total:** ~5-8 días para los 2 milestones restantes.

## Dependencias externas

| Milestone | Dependencia | Notas |
|-----------|-------------|-------|
| M016 | LRCLIB.net API | Gratis, sin key, devuelve LRC con timestamps |
| M018 | ffmpeg | En Dockerfile y disponible localmente |

## Para retomar

```
1. Leer este handover
2. /gsd status para ver el estado general
3. Decidir: M019 (Graceful Resize) o M017 (Cassette Deck)
4. Planificar y ejecutar
```

---

*Proyecto estable. 16 milestones entregados. Sin bugs conocidos. 2 milestones pendientes.*
