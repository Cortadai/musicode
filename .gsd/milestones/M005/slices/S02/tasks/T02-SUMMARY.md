---
id: T02
parent: S02
milestone: M005
provides: []
requires: []
affects: []
key_files: ["musicode-ui/public/sw.js", "musicode-ui/src/main.tsx"]
key_decisions: ["Hand-written SW instead of vite-plugin-pwa — simpler, educational, no build dependency", "Network-first for app shell with cache fallback (offline-resilient)", "Cache-first for cover art (immutable content)", "Network-only for /api/* (never cache auth/data/streams)", "SW registered on window load event to not block initial render"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build + npm run test:coverage — both pass. SW and manifest in dist/."
completed_at: 2026-03-31T10:57:55.605Z
blocker_discovered: false
---

# T02: Service worker with app shell cache, cover art cache, and API passthrough — registered from main.tsx.

> Service worker with app shell cache, cover art cache, and API passthrough — registered from main.tsx.

## What Happened
---
id: T02
parent: S02
milestone: M005
key_files:
  - musicode-ui/public/sw.js
  - musicode-ui/src/main.tsx
key_decisions:
  - Hand-written SW instead of vite-plugin-pwa — simpler, educational, no build dependency
  - Network-first for app shell with cache fallback (offline-resilient)
  - Cache-first for cover art (immutable content)
  - Network-only for /api/* (never cache auth/data/streams)
  - SW registered on window load event to not block initial render
duration: ""
verification_result: passed
completed_at: 2026-03-31T10:57:55.605Z
blocker_discovered: false
---

# T02: Service worker with app shell cache, cover art cache, and API passthrough — registered from main.tsx.

**Service worker with app shell cache, cover art cache, and API passthrough — registered from main.tsx.**

## What Happened

Hand-written service worker with three strategies: network-first for app shell (HTML/CSS/JS) with cache fallback for offline, cache-first for cover art (/api/covers/*), and network-only for all other API calls. Cache versioning via CACHE_VERSION constant. Old caches cleaned on activate. Registered from main.tsx on window load with console.debug logging.

## Verification

npm run build + npm run test:coverage — both pass. SW and manifest in dist/.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 4400ms |
| 2 | `npm run test:coverage` | 0 | ✅ pass — 40 tests, 91.54% lines | 4400ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/public/sw.js`
- `musicode-ui/src/main.tsx`


## Deviations
None.

## Known Issues
None.
