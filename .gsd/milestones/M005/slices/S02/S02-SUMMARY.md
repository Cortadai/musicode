---
id: S02
parent: M005
milestone: M005
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - musicode-ui/public/manifest.json
  - musicode-ui/public/sw.js
  - musicode-ui/index.html
  - musicode-ui/src/main.tsx
key_decisions:
  - Hand-written SW over vite-plugin-pwa
  - Three caching strategies: network-first shell, cache-first covers, network-only API
  - Placeholder icons sufficient for install prompt
patterns_established:
  - Hand-written service worker with strategy-per-route
  - Cache versioning with manual CACHE_VERSION bump
  - SW registration deferred to window load
observability_surfaces:
  - console.debug [sw] for registration, install, activate, and cache operations
drill_down_paths:
  - .gsd/milestones/M005/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M005/slices/S02/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T10:58:22.470Z
blocker_discovered: false
---

# S02: PWA Support

**PWA installable \u2014 manifest, service worker with shell/cover caching, standalone window.**

## What Happened

Made Musicode installable as a PWA. Manifest.json with display:standalone, theme colors matching the dark theme, and placeholder icons. Hand-written service worker with three caching strategies: network-first for app shell (offline-resilient), cache-first for cover art (immutable content), and network-only for API calls (never cache auth/data/streams). Cache versioning for clean deployments. Registered from main.tsx on window load. Browser shows install prompt, app opens in standalone window without browser chrome.

## Verification

npm run build + npm run test:coverage \u2014 both pass, manifest/sw/icons in dist/.

## Requirements Advanced

- R012 — manifest.json + service worker + app shell cache + standalone display

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

Icons are solid-color placeholders. Replace with designed icons later.

## Follow-ups

Replace placeholder icons with designed ones when visual identity is finalized.

## Files Created/Modified

- `musicode-ui/public/manifest.json` — App name, display:standalone, icons, theme colors
- `musicode-ui/public/icons/icon-192.png` — 192x192 indigo placeholder
- `musicode-ui/public/icons/icon-512.png` — 512x512 indigo placeholder
- `musicode-ui/public/sw.js` — App shell + cover art cache, API passthrough
- `musicode-ui/index.html` — Manifest link, theme-color meta, corrected title
- `musicode-ui/src/main.tsx` — Service worker registration on load
