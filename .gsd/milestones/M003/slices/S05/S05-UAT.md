# S05: Caddy Reverse Proxy & HTTPS — UAT

**Milestone:** M003
**Written:** 2026-03-31T09:50:42.808Z

## UAT: S05 \u2014 Caddy Reverse Proxy & HTTPS\n\n### Test 1: HTTPS on localhost\n1. Run `docker-compose up`\n2. Open https://localhost in browser\n3. **Expected:** Login page loads with valid TLS (Caddy internal CA)\n\n### Test 2: HTTP redirect\n1. Open http://localhost\n2. **Expected:** Redirected to https://localhost (308)\n\n### Test 3: Login through Caddy\n1. Login as admin on https://localhost\n2. **Expected:** Login succeeds, albums page loads\n\n### Test 4: Port 8080 isolated\n1. Try http://localhost:8080\n2. **Expected:** Connection refused \u2014 Spring Boot not reachable from host\n\n### Test 5: API through HTTPS\n1. Browse library, play a track\n2. **Expected:** All API calls work through Caddy TLS proxy, audio streams correctly
