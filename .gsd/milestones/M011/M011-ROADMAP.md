# M011: Quality & Hardening

## Vision
Blindar el aplicativo existente antes de añadir funcionalidad nueva. Mejorar mantenibilidad, accesibilidad, testabilidad y robustez del frontend y backend.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | high | — | ✅ | PlayerBar dividido en componentes independientes. Reproducción, crossfade, EQ y visualizer funcionan idéntico. |
| S02 | S02 | medium | — | ✅ | React DevTools Profiler muestra reducción medible de re-renders en listas de tracks/albums. |
| S03 | S03 | low | — | ✅ | Navegación completa con teclado. Screen reader anuncia todos los controles del player. |
| S04 | S04 | medium | — | ✅ | Vitest + Testing Library ejecutan tests de componentes extraídos y hooks críticos con cobertura >60%. |
| S05 | S05 | low | — | ✅ | Logs distinguen timeout vs auth failure vs config error en Last.fm y ListenBrainz. Frontend cancela requests en unmount. |
