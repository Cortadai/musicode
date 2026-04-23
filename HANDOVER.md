# Handover — 23 abril 2026

## Resumen

**12 milestones completados** (M001–M012). M013 (Visual Experience) ejecutado pero **necesita remediación** — bug de stacking context en NowPlayingOverlay.

### Lo que se hizo desde el último handover (18 abril)

1. **M011 — Quality & Hardening**: Extracción PlayerBar (465→componentes), React.memo, 109 tests frontend, typed error handling con retry
2. **M012 — Structural Cleanup & CI**: Descomposición usePlayer (418→190 LOC), lazy routes, role-based guards, GitHub Actions CI
3. **M013 — Visual Experience** (4 slices ejecutados, bug pendiente):
   - S01: Color extraction desde cover art, dynamic theme toggle
   - S02: NowPlayingOverlay fullscreen con controles, Up Next, animaciones
   - S03: Visualizer integrado en overlay, crossfade de artwork
   - S04: Scrobble status indicator en PlayerBar
4. **Reajuste GSD** (esta sesión): R017–R023 validados, R024–R026 actualizados, STATE.md corregido

### Bug activo: NowPlayingOverlay stacking context

El overlay se renderiza dentro del PlayerBar. El PlayerBar tiene `animate-slide-up` que usa `transform` — esto crea un containing block para `position: fixed`. Resultado:
- El overlay no cubre toda la pantalla
- Los controles del PlayerBar quedan visibles debajo
- La sidebar se cuela

**Fix propuesto** (acordado con usuario, no implementado):
1. `createPortal(…, document.body)` para escapar el stacking context
2. Visualizer como fondo del overlay completo con opacidad baja
3. Artwork responsivo hasta `w-96 h-96` en `lg:`
4. Ocultar/bajar z-index del PlayerBar cuando overlay está abierto

---

## Estado del repo

- **Branch**: `main`
- **12 milestones cerrados** (M001–M012)
- **M013**: 4 slices ejecutados, needs-remediation
- **Cambios sin commitear**: artefactos GSD actualizados (REQUIREMENTS, STATE, CODEBASE)

## Métricas

- **877 tracks** en librería
- **345 tests**: 236 backend + 109 frontend
- **21 E2E Playwright**
- **React.memo**: en uso (post-M011)
- **Lazy routes**: en uso (post-M012)
- **CI**: GitHub Actions (post-M012)

## Requirements

- **20 validados** (R001–R013, R017–R023, R026)
- **2 activos** (R024 Now Playing overlay, R025 color extraction — ambos implementados, bloqueados por bug)
- **3 diferidos** (R014 Subsonic, R015 transcoding, R016 out-of-scope)

## Milestones en cola

| ID | Milestone |
|----|-----------|
| **M013** | Visual Experience — remediar bug, validar, cerrar |
| M014 | Smart Library — edición metadata, filesystem watcher, smart playlists |
| M015 | Integrations & Streaming — lyrics .lrc, transcoding, Subsonic API |

## Archivos clave para la remediación M013

- `musicode-ui/src/components/player/NowPlayingOverlay.tsx` — overlay con el bug
- `musicode-ui/src/components/player/PlayerBar.tsx` — parent con CSS transform
- `musicode-ui/src/hooks/useColorExtraction.ts` — extracción de color
- `musicode-ui/src/index.css` — animaciones y tema dinámico

## Para retomar

```
1. Leer este handover
2. /gsd status para ver el estado de M013
3. Implementar fix del portal (createPortal a document.body)
4. Validar overlay, cerrar M013
```

---

*M013 tiene trabajo ejecutado con bug conocido. El fix está diagnosticado y acordado.*
