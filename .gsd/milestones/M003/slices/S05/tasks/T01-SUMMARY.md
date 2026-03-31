---
id: T01
parent: S05
milestone: M003
provides: []
requires: []
affects: []
key_files: ["Caddyfile", "caddy/Dockerfile", "docker-compose.yml", "musicode-server/src/main/resources/application-docker.yml"]
key_decisions: ["Caddy serves React build from /srv, reverse-proxies /api/* to Spring Boot", "Caddyfile uses handle blocks for ordering: API first, static fallback second", "application-docker.yml: secure cookies, env-configurable JWT secret and admin password", "Frontend nginx service removed — Caddy replaces it", "Caddy Dockerfile builds React in multi-stage and copies dist to /srv"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "docker compose config validates. docker compose build succeeds."
completed_at: 2026-03-31T09:49:57.856Z
blocker_discovered: false
---

# T01: Caddyfile + Caddy Dockerfile + docker-compose restructured — Caddy serves React + proxies API, Spring Boot internal only.

> Caddyfile + Caddy Dockerfile + docker-compose restructured — Caddy serves React + proxies API, Spring Boot internal only.

## What Happened
---
id: T01
parent: S05
milestone: M003
key_files:
  - Caddyfile
  - caddy/Dockerfile
  - docker-compose.yml
  - musicode-server/src/main/resources/application-docker.yml
key_decisions:
  - Caddy serves React build from /srv, reverse-proxies /api/* to Spring Boot
  - Caddyfile uses handle blocks for ordering: API first, static fallback second
  - application-docker.yml: secure cookies, env-configurable JWT secret and admin password
  - Frontend nginx service removed — Caddy replaces it
  - Caddy Dockerfile builds React in multi-stage and copies dist to /srv
duration: ""
verification_result: passed
completed_at: 2026-03-31T09:49:57.856Z
blocker_discovered: false
---

# T01: Caddyfile + Caddy Dockerfile + docker-compose restructured — Caddy serves React + proxies API, Spring Boot internal only.

**Caddyfile + Caddy Dockerfile + docker-compose restructured — Caddy serves React + proxies API, Spring Boot internal only.**

## What Happened

Created Caddyfile with localhost TLS, API reverse proxy, and SPA static file serving. Built Caddy Dockerfile with multi-stage React build. Created application-docker.yml with secure cookies, env-configurable secrets. Restructured docker-compose.yml: Caddy replaces nginx frontend, exposes 80/443, Spring Boot internal only with expose. Fixed Caddyfile handle ordering bug (API handle must come before file_server to avoid 405 on POST).

## Verification

docker compose config validates. docker compose build succeeds.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `docker compose config --quiet` | 0 | ✅ pass | 500ms |
| 2 | `docker compose build` | 0 | ✅ pass | 50200ms |


## Deviations

Fixed Caddyfile handle ordering — API handle before file_server to prevent 405 on POST requests. Fixed Spring placeholder syntax (:-) which wasn't causing issues but cleaned up.

## Known Issues

None.

## Files Created/Modified

- `Caddyfile`
- `caddy/Dockerfile`
- `docker-compose.yml`
- `musicode-server/src/main/resources/application-docker.yml`


## Deviations
Fixed Caddyfile handle ordering — API handle before file_server to prevent 405 on POST requests. Fixed Spring placeholder syntax (:-) which wasn't causing issues but cleaned up.

## Known Issues
None.
