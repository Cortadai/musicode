# M014: Library Health Dashboard

## Vision
Panel que analiza la librería musical y muestra problemas de metadata (tracks sin artista, álbumes sin carátula, etc.) para que el usuario sepa qué corregir en herramientas externas como MusicBrainz Picard.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | low | — | ✅ | curl a /api/library/health/summary y /issues devuelve datos correctos |
| S02 | S02 | low | — | ✅ | Navegar a /library/health, ver cards de resumen, click para ver detalles con paginación |
