---
id: T01
parent: S03
milestone: M026
key_files:
  - sonance-desktop/scripts/build-app.sh
  - sonance-desktop/main.js
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T14:03:40.618Z
blocker_discovered: false
---

# T01: Production mode loads from localhost:8080 — Spring Boot serves both API and React static files

**Production mode loads from localhost:8080 — Spring Boot serves both API and React static files**

## What Happened

In packaged mode, main.js loads http://localhost:8080 (Spring Boot). The build-app.sh script builds React, copies dist/ into sonance-server/src/main/resources/static/, then builds the fat JAR with frontend included. Verified: Sonance.exe starts, Spring Boot serves the app at :8080.

## Verification

Ran Sonance.exe from dist/win-unpacked/ — Spring Boot started in 5.4s serving both API and frontend at localhost:8080.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `Sonance.exe (packaged)` | 0 | pass | 30000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sonance-desktop/scripts/build-app.sh`
- `sonance-desktop/main.js`
