# S05: PWA Offline Basics

**Goal:** PWA Offline Basics — manifest installable, offline detection with graceful UI, app shell loads offline
**Demo:** App funciona offline mostrando contenido cacheado, manifest válido, installable

## Must-Haves

- App funciona offline mostrando contenido cacheado, manifest válido, installable en Chrome/Edge

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Fix manifest.json for installability** `est:10m`
  Add id field, purpose maskable to icons, verify all required PWA manifest fields for Chrome installability
  - Files: `musicode-ui/public/manifest.json`, `musicode-ui/public/icons/icon-192.png`, `musicode-ui/public/icons/icon-512.png`
  - Verify: Production build manifest passes PWA installability checks

- [x] **T02: Add useOnlineStatus hook and offline banner** `est:20m`
  Create a hook that detects online/offline status via navigator.onLine + event listeners. Add a non-intrusive offline banner that appears when the server is unreachable.
  - Files: `musicode-ui/src/hooks/useOnlineStatus.ts`, `musicode-ui/src/components/common/OfflineBanner.tsx`, `musicode-ui/src/App.tsx`
  - Verify: Banner appears when network is toggled offline in DevTools, disappears when back online

- [x] **T03: Build and verify PWA installability** `est:15m`
  Run production build, verify manifest is valid, SW registers, app shell loads offline, and installability criteria are met
  - Files: `musicode-ui/vite.config.ts`
  - Verify: npm run build succeeds, manifest valid, SW caches app shell

## Files Likely Touched

- musicode-ui/public/manifest.json
- musicode-ui/public/icons/icon-192.png
- musicode-ui/public/icons/icon-512.png
- musicode-ui/src/hooks/useOnlineStatus.ts
- musicode-ui/src/components/common/OfflineBanner.tsx
- musicode-ui/src/App.tsx
- musicode-ui/vite.config.ts
