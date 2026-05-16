---
id: T01
parent: S02
milestone: M026
key_files:
  - sonance-desktop/sidecar.js
  - sonance-desktop/main.js
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T13:52:17.054Z
blocker_discovered: false
---

# T01: Sidecar module spawns JAR, polls /actuator/health, emits ready — Spring Boot starts in ~6s

**Sidecar module spawns JAR, polls /actuator/health, emits ready — Spring Boot starts in ~6s**

## What Happened

Created sidecar.js with start/stop/isRunning API. Resolves JAR path dynamically (dev: glob target/ dir, prod: resourcesPath). Polls health endpoint every 1s with 45s timeout. Passes process.env to child for SONANCE_TOKEN_ENCRYPTION_KEY and other vars. Tested end-to-end: Java spawns, Spring Boot starts in 6s, health check passes, main.js proceeds to load app URL.

## Verification

Ran Electron with sidecar enabled — saw '[main] Sidecar ready, loading app' after Spring Boot started in 5.9s. Health polling worked correctly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `electron . (with SONANCE_TOKEN_ENCRYPTION_KEY set)` | 0 | pass | 35000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sonance-desktop/sidecar.js`
- `sonance-desktop/main.js`
