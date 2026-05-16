# M024: Quality Gate — Auditoría pre-merge

## Vision
Blindar la rama ux-polish antes del merge a main: CI verde, cobertura de tests mejorada, bundle optimizado, accesibilidad básica, y limpieza de deuda técnica. El merge a main debe ser seguro y confiable.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | low | — | ✅ | GitHub Actions workflow pasa localmente con act o simulación manual de los 3 jobs |
| S02 | S02 | medium | — | ✅ | Coverage report muestra >= 40% lines con tests significativos (no snapshots vacíos) |
| S03 | Bundle Performance | medium | S01 | ✅ | Bundle analyzer muestra chunks separados para recharts y particles, carga inicial < 500KB |
| S04 | Accesibilidad Básica | low | S01 | ✅ | axe-core audit en páginas principales con 0 violaciones críticas |
| S05 | S05 | medium | — | ✅ | App funciona offline mostrando contenido cacheado, manifest válido, installable |
| S06 | Limpieza Final y Merge Readiness | low | S02, S03, S04, S05 | ✅ | Rama lista para merge: sin dead code, sin console.logs, sin TODOs abiertos críticos |
