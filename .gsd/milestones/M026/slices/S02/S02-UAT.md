# S02: Spring Boot Sidecar — UAT

**Milestone:** M026
**Written:** 2026-05-10T13:52:45.124Z

## UAT — S02: Spring Boot Sidecar\n\n### Prerequisites\n- `mvn package -DskipTests` run in sonance-server/\n- `SONANCE_TOKEN_ENCRYPTION_KEY` env var set\n- sonance-desktop/ dependencies installed\n\n### Test Cases\n\n- [ ] **TC1: Sidecar starts** — Run `npx electron .` from sonance-desktop/. Loading screen appears, then app loads after ~6s.\n- [ ] **TC2: Health check polling** — Observe console: '[sidecar] Starting...' followed by '[main] Sidecar ready, loading app'.\n- [ ] **TC3: Clean shutdown** — Close the window. Run `wmic process where name='java.exe' get ProcessId` — no results.\n- [ ] **TC4: Startup failure** — Remove the JAR file, launch Electron. Should show error and quit gracefully.\n- [ ] **TC5: Dev mode bypass** — Set `app.isPackaged` to false (default). Sidecar should not start; app loads from vite.
