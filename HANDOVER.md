# Handover — 25 abril 2026

## Resumen

**13 milestones completados** (M001–M013). Proyecto en estado idle — sin milestone activo. Backlog revisado y priorizado: 5 milestones pendientes, 1 descartado.

### Lo que se hizo en esta sesión (25 abril)

Sesión de limpieza y priorización del backlog. Revisión uno a uno de M014–M018:

1. **M014 pivotado** — Metadata Editing descartado (Picard lo hace mejor). Redefinido como **Library Health Dashboard**: panel que detecta problemas de metadata y orienta al usuario a corregirlos con Picard.
2. **M015 descartado** — Filesystem Watcher eliminado. El re-scan manual es rápido (~900 tracks), la complejidad del watcher (debounce, recursividad, Docker bind mounts sin eventos nativos) no justifica el ahorro de un click.
3. **M016 definido** — Synchronized Lyrics con LRCLIB.net. Layout split en NowPlayingOverlay (cover+controles izquierda, letras derecha). Cache en DB.
4. **M017 redefinido** — Cassette Deck como 5º modo del visualizer, no como theme global. Mismo toggle que los otros 4 modos.
5. **M018 nueva** — Waveform Progress Bar (estilo SoundCloud) en la play-bar. Toggle para alternar con barra plana. Backend genera peaks con ffmpeg, lazy on-demand.
6. **M019 nueva** — Graceful Resize (antes "Responsive Layout"). No es diseño mobile — es que la app no se rompa al redimensionar la ventana (half-screen, side-by-side). Sidebar colapsable + player bar sin desborde.

---

## Estado del repo

- **Branch**: `main`
- **13 milestones cerrados** (M001–M013)
- **Sin milestone activo**

## Métricas

- **877 tracks** en librería
- **345 tests**: 236 backend + 109 frontend
- **21 E2E Playwright**
- **22 requirements validados**, 3 diferidos, 1 out-of-scope

## Requirements

- **22 validados** (R001–R013, R017–R026)
- **0 activos**
- **3 diferidos** (R014 Subsonic, R015 transcoding, R016 out-of-scope)

## Backlog priorizado

| Orden | ID | Milestone | Scope | Est. |
|-------|----|-----------|-------|------|
| 1 | M014 | **Library Health Dashboard** | Panel que analiza metadata y muestra problemas (tracks sin título/artista/álbum, álbumes sin cover, ALBUMARTIST inconsistente). Solo informa, no corrige. Mensaje orientativo hacia Picard. Backend: `LibraryHealthService` + endpoints summary/issues paginados. Frontend: página `/library/health` con cards resumen + tabla filtrable. | 2-3 días |
| 2 | M016 | **Synchronized Lyrics** | Letras sincronizadas en NowPlayingOverlay estilo Spotify. Fuente: LRCLIB.net (gratis, con timestamps). Fallback: tags embebidos (SYLT/LRC). Backend: `LyricsService` + campo `syncedLyrics` en Track (cache) + endpoint. Frontend: botón Lyrics junto a los 4 modos visualizer, layout split (cover+controles izquierda, letras scrolleando derecha), highlight línea actual, auto-scroll suave. Sin Genius/Musixmatch. | 3-4 días |
| 3 | M018 | **Waveform Progress Bar** | Barra de progreso alternativa en play-bar con forma de onda real (estilo SoundCloud). Backend: `WaveformService` genera ~300 peaks con ffmpeg, campo `waveformData` en Track, lazy on-demand (no durante scan). Frontend: `WaveformBar` canvas, seek por click/drag, toggle barra plana ↔ waveform (persistido en localStorage). Solo en play-bar, no en NowPlayingOverlay. | 3-4 días |
| 4 | M019 | **Graceful Resize** | Que la app no se rompa al reducir ventana (~800-1024px). Sidebar colapsable a iconos por debajo de ~1024px. PlayerBar sin desborde. No es diseño mobile: sin hamburger, sin touch gestures, sin breakpoints portrait. | 1-2 días |
| 5 | M017 | **Cassette Deck Visualizer** | 5º modo del visualizer en NowPlayingOverlay. Carretes girando proporcional al progreso, cinta enrollándose, contador mecánico, label con fuente typewriter. 100% frontend. Opcionalmente filtro de audio tipo cinta (wow & flutter, tape hiss via Web Audio API). Último milestone — puro deleite. | 4-6 días |

**Descartado:** ~~M015 Filesystem Watcher~~

**Estimación total:** ~14-19 días para los 5 milestones.

## Dependencias externas

| Milestone | Dependencia | Notas |
|-----------|-------------|-------|
| M016 | LRCLIB.net API | Gratis, sin key, devuelve LRC con timestamps |
| M018 | ffmpeg | Disponible en local, añadir al Dockerfile |

## Para retomar

```
1. Leer este handover
2. /gsd status para ver el estado general
3. Planificar formalmente M014 (Library Health Dashboard) — generar milestone ID, slices, tasks
4. Ejecutar M014
```

---

*Proyecto estable. 13 milestones entregados. Sin bugs conocidos. Backlog limpio y priorizado.*
