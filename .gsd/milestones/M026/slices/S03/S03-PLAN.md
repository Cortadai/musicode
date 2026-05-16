# S03: Build & Packaging

**Goal:** Configure electron-builder to produce a Windows installer (.exe) that bundles the React build, Spring Boot JAR, and a JRE
**Demo:** electron-builder produces a working .exe installer that bundles JRE + JAR + frontend

## Must-Haves

- Running `npm run dist` produces a working .exe installer. Installing and launching plays music end-to-end.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Production URL and React build integration** `est:15min`
  In production mode, Spring Boot serves the React static files from its classpath. Configure main.js to load http://localhost:8080 (Spring Boot serves both API and frontend). Verify the React build output goes into sonance-server resources for the fat JAR.
  - Files: `sonance-desktop/main.js`, `sonance-ui/package.json`
  - Verify: Build React, build JAR with static files included, confirm http://localhost:8080 serves the SPA

- [x] **T02: JRE bundling strategy** `est:20min`
  Document and script the JRE download for bundling. Use jlink or adoptium to get a minimal JRE. Add a script to fetch it into sonance-desktop/jre/. Update electron-builder extraResources.
  - Files: `sonance-desktop/scripts/download-jre.sh`, `sonance-desktop/package.json`
  - Verify: Script downloads JRE, electron-builder config references it correctly

- [x] **T03: electron-builder configuration and test build** `est:25min`
  Finalize electron-builder config: NSIS installer, extraResources (JAR + JRE), app metadata, icon placeholder. Run npm run dist and verify output.
  - Files: `sonance-desktop/package.json`
  - Verify: npm run dist produces .exe in dist/ directory

## Files Likely Touched

- sonance-desktop/main.js
- sonance-ui/package.json
- sonance-desktop/scripts/download-jre.sh
- sonance-desktop/package.json
