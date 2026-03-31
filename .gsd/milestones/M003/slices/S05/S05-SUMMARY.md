---
id: S05
parent: M003
milestone: M003
provides:
  - Complete HTTPS deployment architecture
  - NAS-ready config (swap localhost in Caddyfile)
requires:
  - slice: S02
    provides: Auth endpoints and secure cookie config
  - slice: S04
    provides: React app with auth flow
affects:
  []
key_files:
  - Caddyfile
  - caddy/Dockerfile
  - docker-compose.yml
  - musicode-server/src/main/resources/application-docker.yml
key_decisions:
  - Caddy replaces nginx as reverse proxy + static server
  - Caddy Dockerfile includes React build stage (no separate frontend service)
  - Spring Boot expose-only: port 8080 not reachable from host
  - application-docker.yml with env-configurable secrets
patterns_established:
  - Caddy handle block ordering: API first, static fallback second
  - Caddy Dockerfile with multi-stage React build
  - Docker Compose: Caddy as sole external-facing service
observability_surfaces:
  - Caddy access logs via docker-compose logs caddy
drill_down_paths:
  - .gsd/milestones/M003/slices/S05/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S05/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T09:50:42.807Z
blocker_discovered: false
---

# S05: Caddy Reverse Proxy & HTTPS

**Caddy reverse proxy with automatic HTTPS \u2014 serves React + proxies API, Spring Boot internal only, verified end-to-end.**

## What Happened

Added Caddy as TLS-terminating reverse proxy, replacing the nginx frontend service. Caddy Dockerfile builds React in multi-stage and serves from /srv. Caddyfile uses handle blocks: /api/* reverse-proxies to musicode-server:8080, everything else serves React with SPA fallback. Docker Compose restructured: Caddy on ports 80/443, Spring Boot internal-only with expose. application-docker.yml configures secure cookies and env-configurable secrets. Verified: HTTP→HTTPS redirect (308), login works via HTTPS, protected endpoints work with cookies, React app served via HTTPS, port 8080 unreachable from host. Caddy's internal CA handles localhost TLS automatically.

## Verification

5 manual checks passed: HTTP\u2192HTTPS redirect, login via HTTPS, protected endpoints with cookies, React via HTTPS, port 8080 isolated.

## Requirements Advanced

- R019 — Caddy TLS termination, HTTP→HTTPS redirect, Spring Boot internal only
- R009 — Docker Compose with Caddy replaces nginx, single docker-compose up

## Requirements Validated

- R019 — HTTPS on localhost with Caddy internal CA, HTTP 308 redirect, port 8080 isolated, login and API work through TLS

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Fixed Caddyfile handle ordering (API before file_server). Old nginx frontend service removed entirely.

## Known Limitations

Caddy's internal CA cert needs to be installed on client devices for trusted HTTPS without browser warnings. On localhost, Chrome/Edge trust it automatically.

## Follow-ups

For NAS deployment: change localhost to IP/domain in Caddyfile. Install Caddy root CA on family devices. Consider Let's Encrypt if domain is available.

## Files Created/Modified

- `Caddyfile` — localhost TLS, API reverse proxy, SPA static serving
- `caddy/Dockerfile` — Multi-stage React build + Caddy with static files
- `docker-compose.yml` — Caddy replaces nginx, Spring Boot internal, ports 80/443
- `musicode-server/src/main/resources/application-docker.yml` — Secure cookies, env-configurable JWT secret and admin password
- `musicode-ui/src/context/AuthContext.test.ts` — Fixed unused variable TS error
