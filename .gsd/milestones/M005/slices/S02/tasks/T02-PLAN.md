---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: Service worker + registration

Create public/sw.js as a hand-written service worker (no workbox/vite-plugin-pwa — keeps it simple and educational). Strategy: app shell files (index.html, CSS, JS from build) cached on install. Cover art cached on fetch (cache-first for /api/covers/*). All other /api/* requests pass through (network-only — never cache auth or data). Fallback: if network fails and cache misses, return a simple offline page. Register the SW from main.tsx with console.debug logging. Add navigator.serviceWorker.register in main.tsx with scope '/'.

## Inputs

- `Build output structure (dist/)`

## Expected Output

- `public/sw.js`
- `Updated main.tsx with SW registration`

## Verification

npm run build compiles. Manual: install PWA, app loads in standalone, cover art cached.
