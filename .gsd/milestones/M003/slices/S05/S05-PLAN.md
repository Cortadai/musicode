# S05: Caddy Reverse Proxy & HTTPS

**Goal:** Add Caddy as TLS-terminating reverse proxy in Docker Compose — single external entry point, HTTPS on localhost, Spring Boot internal only
**Demo:** After this: After this: docker-compose up starts Caddy + Spring Boot. Browser accesses https://localhost, gets valid TLS, login page loads, full app works through HTTPS. Spring Boot port 8080 not reachable from host.

## Tasks
- [x] **T01: Caddyfile + Caddy Dockerfile + docker-compose restructured — Caddy serves React + proxies API, Spring Boot internal only.** — Create Caddyfile: localhost block that serves React static build from /srv and reverse-proxies /api/* to spring-boot:8080. Handle SPA routing (try_files equivalent). Proxy headers for real IP. Create application-docker.yml for Spring Boot with: secure cookies (musicode.cookies.secure: true), strong JWT secret, admin default password. Remove the separate nginx frontend service — Caddy replaces it. Update docker-compose.yml: add caddy service (caddy:2-alpine, ports 80/443, volumes for Caddyfile + caddy_data + caddy_config + React build), change backend to expose-only (no ports), remove frontend service. Caddy needs the React build — either multi-stage build copies it into Caddy image, or a shared volume. Simplest: build React in Caddy's Dockerfile.
  - Estimate: 25min
  - Files: Caddyfile, musicode-server/src/main/resources/application-docker.yml, docker-compose.yml, caddy/Dockerfile
  - Verify: docker-compose config — validates compose file
- [x] **T02: docker-compose up verified — HTTPS login, API proxy, React serving, port isolation all working.** — Build and start docker-compose. Verify: https://localhost loads login page with valid TLS. HTTP redirects to HTTPS. Login as admin works. Browse library, play audio through Caddy. Port 8080 not reachable from host. Caddy logs show requests. Fix any issues.
  - Estimate: 15min
  - Verify: docker-compose up builds and serves via HTTPS, login works, audio streams
