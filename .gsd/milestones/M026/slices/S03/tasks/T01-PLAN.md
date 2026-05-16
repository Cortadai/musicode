---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Production URL and React build integration

In production mode, Spring Boot serves the React static files from its classpath. Configure main.js to load http://localhost:8080 (Spring Boot serves both API and frontend). Verify the React build output goes into sonance-server resources for the fat JAR.

## Inputs

- `Current vite build output dir`
- `Spring Boot static resource serving config`

## Expected Output

- `Production app loads from Spring Boot at :8080 (single port)`

## Verification

Build React, build JAR with static files included, confirm http://localhost:8080 serves the SPA
