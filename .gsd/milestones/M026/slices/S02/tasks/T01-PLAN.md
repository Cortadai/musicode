---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Sidecar spawn and health check

Add sidecar.js module that spawns java -jar with correct path resolution (dev vs packaged), polls GET /api/health or actuator/health until 200, emits ready event. Handle spawn errors and timeout (30s max startup).

## Inputs

- `Spring Boot actuator health endpoint path`
- `JAR output location from mvn package`

## Expected Output

- `sidecar.js module with start/stop/onReady API`
- `main.js integrates sidecar before loading URL`

## Verification

Build the JAR, run electron in dev mode — backend starts, health check passes, UI loads with full API access
