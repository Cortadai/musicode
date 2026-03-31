# S02: PWA Support — UAT

**Milestone:** M005
**Written:** 2026-03-31T10:58:22.470Z

## UAT: S02 \u2014 PWA Support\n\n### Test 1: Install prompt\n1. Open Musicode in Chrome\n2. Look for install icon in address bar or three-dot menu \u2192 'Install Musicode'\n3. **Expected:** Install prompt appears with Musicode name and icon\n\n### Test 2: Standalone window\n1. Install the PWA\n2. Open from desktop/start menu\n3. **Expected:** Opens in own window without browser address bar or tabs\n\n### Test 3: App shell caching\n1. Open Musicode, navigate around\n2. Check DevTools \u2192 Application \u2192 Cache Storage\n3. **Expected:** musicode-v1 cache contains index.html, CSS, JS\n\n### Test 4: Cover art caching\n1. Browse albums with cover art\n2. Check DevTools \u2192 Cache Storage \u2192 musicode-covers-v1\n3. **Expected:** Cover art URLs cached\n\n### Test 5: API not cached\n1. Check Cache Storage\n2. **Expected:** No /api/auth/*, /api/tracks/*, etc. in any cache\n\n### Test 6: Build and tests\n1. npm run build + npm run test:coverage\n2. **Expected:** Both pass
