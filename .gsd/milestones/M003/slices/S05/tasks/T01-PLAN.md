---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T01: Caddyfile + docker-compose with Caddy

Create Caddyfile: localhost block that serves React static build from /srv and reverse-proxies /api/* to spring-boot:8080. Handle SPA routing (try_files equivalent). Proxy headers for real IP. Create application-docker.yml for Spring Boot with: secure cookies (musicode.cookies.secure: true), strong JWT secret, admin default password. Remove the separate nginx frontend service — Caddy replaces it. Update docker-compose.yml: add caddy service (caddy:2-alpine, ports 80/443, volumes for Caddyfile + caddy_data + caddy_config + React build), change backend to expose-only (no ports), remove frontend service. Caddy needs the React build — either multi-stage build copies it into Caddy image, or a shared volume. Simplest: build React in Caddy's Dockerfile.

## Inputs

- `Current docker-compose.yml`
- `Current nginx.conf`
- `Current musicode-ui/Dockerfile`

## Expected Output

- `Caddyfile`
- `application-docker.yml`
- `Updated docker-compose.yml`
- `Caddy Dockerfile`

## Verification

docker-compose config — validates compose file
