/**
 * Musicode Service Worker — app shell caching for instant load.
 *
 * CACHING STRATEGY:
 * - App shell (HTML, CSS, JS): cached on install, served cache-first.
 *   These are versioned by Vite's content hashing — new deploys get new filenames.
 * - Cover art (/api/covers/*): cached on first fetch, served cache-first.
 *   Covers rarely change and are already served with Cache-Control: 7 days.
 * - API calls (/api/*): always network-only. Never cache auth, data, or streams.
 *   Caching API responses would cause stale auth state and confusing behavior.
 * - Navigation (HTML): network-first with cache fallback. If offline, the cached
 *   app shell loads and shows the login or "server unreachable" state.
 *
 * CACHE VERSIONING: Bump CACHE_VERSION to invalidate all caches on deploy.
 */

const CACHE_VERSION = 'musicode-v1';
const COVER_CACHE = 'musicode-covers-v1';

// App shell files to precache on install.
// The actual CSS/JS filenames include Vite content hashes — we cache everything
// that comes through during install and rely on the version bump to refresh.
const SHELL_FILES = [
  '/',
  '/manifest.json',
];

// --- Install: precache app shell ---
self.addEventListener('install', (event) => {
  console.debug('[sw] Installing, cache version:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

// --- Activate: clean old caches ---
self.addEventListener('activate', (event) => {
  console.debug('[sw] Activating');
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION && key !== COVER_CACHE)
          .map((key) => {
            console.debug('[sw] Removing old cache:', key);
            return caches.delete(key);
          })
      ))
      .then(() => self.clients.claim())
  );
});

// --- Fetch: strategy per request type ---
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests (POST login, etc.)
  if (event.request.method !== 'GET') return;

  // Cover art: cache-first (images rarely change)
  if (url.pathname.startsWith('/api/covers/')) {
    event.respondWith(
      caches.open(COVER_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // API calls: always network (never cache auth/data/streams)
  if (url.pathname.startsWith('/api/')) return;

  // App shell: network-first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for offline fallback
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
