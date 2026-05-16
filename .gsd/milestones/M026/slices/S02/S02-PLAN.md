# S02: Spring Boot Sidecar

**Goal:** Spawn Spring Boot JAR as child process from Electron main, poll health endpoint until ready, load UI only after backend is up, kill Java process on app quit
**Demo:** Electron app starts, waits for Spring Boot health check, then loads UI. Closing window kills Java process.

## Must-Haves

- App starts → splash/loading shown → Java spawned → health check passes → UI loads → close window → Java process terminated, no zombies

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Sidecar spawn and health check** `est:25min`
  Add sidecar.js module that spawns java -jar with correct path resolution (dev vs packaged), polls GET /api/health or actuator/health until 200, emits ready event. Handle spawn errors and timeout (30s max startup).
  - Files: `sonance-desktop/sidecar.js`, `sonance-desktop/main.js`
  - Verify: Build the JAR, run electron in dev mode — backend starts, health check passes, UI loads with full API access

- [x] **T02: Graceful shutdown and zombie prevention** `est:15min`
  On app quit and window-all-closed, kill the Java child process. Handle edge cases: process already dead, SIGTERM not enough (escalate to SIGKILL after 5s), cleanup on uncaught exceptions and SIGINT.
  - Files: `sonance-desktop/sidecar.js`, `sonance-desktop/main.js`
  - Verify: Close electron, verify no java.exe processes remain via tasklist

- [x] **T03: Loading screen while backend starts** `est:10min`
  Show a simple loading HTML page (Sonance logo + spinner) in the BrowserWindow while waiting for the backend health check. Switch to the real app URL once ready.
  - Files: `sonance-desktop/loading.html`, `sonance-desktop/main.js`
  - Verify: Visual: window shows loading state, then transitions to app

## Files Likely Touched

- sonance-desktop/sidecar.js
- sonance-desktop/main.js
- sonance-desktop/loading.html
