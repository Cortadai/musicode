# S02: PWA Support

**Goal:** Make Musicode installable as PWA with app shell caching for instant load
**Demo:** After this: After this: browser shows 'Install Musicode' prompt. Installed app opens in standalone window without browser chrome. App shell loads instantly from cache.

## Tasks
- [x] **T01: PWA manifest with icons, theme-color, and display:standalone.** — Create PWA icons (192x192 and 512x512) as simple SVG-based PNGs or use a minimal icon. Create manifest.json in public/ with: name 'Musicode', short_name 'Musicode', start_url '/', display 'standalone', theme_color (indigo-600 = #4f46e5), background_color (zinc-950 = #09090b), icons array. Add manifest link to index.html. Add theme-color meta tag.
  - Estimate: 10min
  - Files: musicode-ui/public/manifest.json, musicode-ui/public/icons/icon-192.png, musicode-ui/public/icons/icon-512.png, musicode-ui/index.html
  - Verify: npm run build compiles
- [x] **T02: Service worker with app shell cache, cover art cache, and API passthrough — registered from main.tsx.** — Create public/sw.js as a hand-written service worker (no workbox/vite-plugin-pwa — keeps it simple and educational). Strategy: app shell files (index.html, CSS, JS from build) cached on install. Cover art cached on fetch (cache-first for /api/covers/*). All other /api/* requests pass through (network-only — never cache auth or data). Fallback: if network fails and cache misses, return a simple offline page. Register the SW from main.tsx with console.debug logging. Add navigator.serviceWorker.register in main.tsx with scope '/'.
  - Estimate: 20min
  - Files: musicode-ui/public/sw.js, musicode-ui/src/main.tsx
  - Verify: npm run build compiles. Manual: install PWA, app loads in standalone, cover art cached.
