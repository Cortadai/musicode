---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: Build, verify HTTPS, fix issues

Build and start docker-compose. Verify: https://localhost loads login page with valid TLS. HTTP redirects to HTTPS. Login as admin works. Browse library, play audio through Caddy. Port 8080 not reachable from host. Caddy logs show requests. Fix any issues.

## Inputs

- `docker-compose.yml from T01`
- `Caddyfile from T01`

## Expected Output

- `Working docker-compose with HTTPS`

## Verification

docker-compose up builds and serves via HTTPS, login works, audio streams
