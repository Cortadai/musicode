---
estimated_steps: 8
estimated_files: 6
skills_used: []
---

# T02: Docker Compose — Dockerfiles + compose config

Create Dockerfiles for backend and frontend, and docker-compose.yml that mounts the music folder and starts everything.

Steps:
1. Create musicode-server/Dockerfile (multi-stage: Maven build + JRE runtime)
2. Create musicode-ui/Dockerfile (multi-stage: npm build + nginx)
3. Create nginx.conf for frontend (SPA routing + API proxy)
4. Create docker-compose.yml with both services + volume mount
5. Create .dockerignore files
6. Test docker-compose up

## Inputs

- `musicode-server/pom.xml`
- `musicode-ui/package.json`

## Expected Output

- `docker-compose.yml`
- `musicode-server/Dockerfile`
- `musicode-ui/Dockerfile`

## Verification

docker-compose up builds and starts both services. Open localhost:3000 → full app works.
