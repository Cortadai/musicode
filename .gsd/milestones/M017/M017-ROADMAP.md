# M017: Graceful Resize

## Vision
La app se adapta sin romperse al reducir la ventana hasta ~800px. Sidebar colapsa a iconos por debajo de 1024px, PlayerBar no desborda, overlays y popovers se ajustan. No es diseño mobile — sin hamburger menu, sin touch gestures, sin breakpoints portrait.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | high | — | ✅ | Reducir ventana a <1024px → sidebar colapsa a iconos. Click en toggle → expande/colapsa. Refresh → estado persiste. |
| S02 | S02 | medium | — | ✅ | Reducir ventana a 800px → PlayerBar muestra todos los controles sin overflow. TrackInfo trunca texto largo. |
| S03 | Overlays & Popovers Responsive | low | S01 | ✅ | Abrir NowPlayingOverlay a 800px → layout usable. Abrir EQ/Crossfade popover → no se corta. Search en TopBar no desborda. |
