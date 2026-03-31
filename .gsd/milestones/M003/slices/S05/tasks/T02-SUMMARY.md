---
id: T02
parent: S05
milestone: M003
provides: []
requires: []
affects: []
key_files: []
key_decisions: ["Verified 5 HTTPS requirements: redirect, login, protected endpoints, React serving, port isolation"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "5 manual checks passed: HTTP→HTTPS redirect (308), login via HTTPS (200), protected endpoint with cookies (200), React app via HTTPS (HTML), port 8080 unreachable from host."
completed_at: 2026-03-31T09:50:11.468Z
blocker_discovered: false
---

# T02: docker-compose up verified — HTTPS login, API proxy, React serving, port isolation all working.

> docker-compose up verified — HTTPS login, API proxy, React serving, port isolation all working.

## What Happened
---
id: T02
parent: S05
milestone: M003
key_files:
  - (none)
key_decisions:
  - Verified 5 HTTPS requirements: redirect, login, protected endpoints, React serving, port isolation
duration: ""
verification_result: passed
completed_at: 2026-03-31T09:50:11.468Z
blocker_discovered: false
---

# T02: docker-compose up verified — HTTPS login, API proxy, React serving, port isolation all working.

**docker-compose up verified — HTTPS login, API proxy, React serving, port isolation all working.**

## What Happened

Built and verified complete Docker Compose stack with Caddy HTTPS. HTTP 308 redirects to HTTPS. Login via HTTPS works and returns user info with cookies. Protected endpoints respond with cookies. React SPA served via HTTPS. Port 8080 not reachable from host — Spring Boot completely internal. Caddy's internal CA handles localhost TLS automatically.

## Verification

5 manual checks passed: HTTP→HTTPS redirect (308), login via HTTPS (200), protected endpoint with cookies (200), React app via HTTPS (HTML), port 8080 unreachable from host.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `curl -ks http://localhost (redirect check)` | 0 | ✅ pass — 308 → https://localhost/ | 200ms |
| 2 | `curl -ks https://localhost/api/auth/login (login)` | 0 | ✅ pass — 200 with user info | 300ms |
| 3 | `curl -ks -b cookies https://localhost/api/albums` | 0 | ✅ pass — 200 with data | 200ms |
| 4 | `curl -ks https://localhost (React)` | 0 | ✅ pass — HTML served | 100ms |
| 5 | `curl http://localhost:8080 (port isolation)` | 28 | ✅ pass — connection refused | 2000ms |


## Deviations

Initial 405 error from Caddyfile handle ordering fixed in T01. Initial login failure from stale DB data resolved by clean rebuild.

## Known Issues

None.

## Files Created/Modified

None.


## Deviations
Initial 405 error from Caddyfile handle ordering fixed in T01. Initial login failure from stale DB data resolved by clean rebuild.

## Known Issues
None.
