---
id: S02
parent: M026
milestone: M026
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["sonance-desktop/sidecar.js", "sonance-desktop/main.js", "sonance-desktop/loading.html"]
key_decisions:
  - ["Health poll at /actuator/health (already exposed by Spring Boot actuator)", "45s timeout for slow machines", "SIGTERM → 5s → SIGKILL escalation pattern", "Dev mode skips sidecar entirely (frontend proxies to separate Spring Boot)", "process.env passed through to child for encryption key and other config"]
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-05-10T13:52:45.123Z
blocker_discovered: false
---

# S02: Spring Boot Sidecar

**Sidecar lifecycle — spawn JAR, health poll, loading screen, graceful shutdown with zero zombies**

## What Happened

Built sidecar.js module that manages Spring Boot as a child process. On app start: shows loading.html with spinner, spawns java -jar, polls /actuator/health every 1s (45s timeout), then loads the real app URL. On quit: SIGTERM with 5s escalation to SIGKILL. Dev mode skips sidecar entirely (loads vite at :5173). Tested full flow — Spring Boot starts in ~6s, health check passes, app loads, clean shutdown leaves no zombie processes.

## Verification

1) Sidecar start: Spring Boot started in 5.9s, health poll succeeded, '[main] Sidecar ready' logged. 2) Shutdown: after Electron exit, wmic confirmed zero java.exe processes. 3) Dev mode: sidecar skipped, vite loaded directly.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
