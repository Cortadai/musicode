---
id: S05
parent: M024
milestone: M024
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - (none)
key_decisions:
  - (none)
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-05-10T08:36:51.401Z
blocker_discovered: false
---

# S05: PWA Offline Basics

**PWA installable con manifest completo, detección offline con banner, y app shell cacheado por service worker**

## What Happened

La infraestructura PWA ya existía (manifest, SW, registro en main.tsx, iconos). Este slice la completó: manifest ahora tiene id, scope, maskable icons y categories para pasar los checks de instalabilidad de Chrome/Edge. Se agregó useOnlineStatus (useSyncExternalStore) y un OfflineBanner con role=alert que muestra barra amber cuando se pierde conexión. El SW existente ya maneja cache-first para app shell y covers, network-only para API.

## Verification

TypeScript limpio, 232 tests pasan, build production en 585ms, todos los artefactos PWA presentes en dist/

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `musicode-ui/public/manifest.json` — Added id, scope, orientation, categories, maskable purpose for installability
- `musicode-ui/src/hooks/useOnlineStatus.ts` — New hook — useSyncExternalStore for online/offline detection
- `musicode-ui/src/components/common/OfflineBanner.tsx` — New component — fixed amber banner with WifiOff icon, role=alert
- `musicode-ui/src/App.tsx` — Integrated OfflineBanner inside BrowserRouter
