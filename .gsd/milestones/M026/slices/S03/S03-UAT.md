# S03: Build & Packaging — UAT

**Milestone:** M026
**Written:** 2026-05-10T14:04:13.555Z

## UAT — S03: Build & Packaging\n\n### Prerequisites\n- JRE downloaded: `npm run download-jre`\n- `SONANCE_TOKEN_ENCRYPTION_KEY` env var set\n- Maven and Node.js installed\n\n### Test Cases\n\n- [ ] **TC1: Build pipeline** — Run `bash scripts/build-app.sh`. React builds, static files copied, JAR created at target/sonance-server.jar.\n- [ ] **TC2: Portable build** — Run `npx electron-builder --dir`. dist/win-unpacked/Sonance.exe exists with resources/jre/ and resources/server/.\n- [ ] **TC3: End-to-end launch** — Run dist/win-unpacked/Sonance.exe. Loading screen appears, then full app loads after ~6s.\n- [ ] **TC4: Bundled paths** — Verify Sonance.exe uses resources/jre/bin/java.exe (not system Java) and resources/server/sonance-server.jar.\n- [ ] **TC5: NSIS installer** — (Requires Developer Mode) Run `npm run dist`. Produces .exe installer in dist/.
