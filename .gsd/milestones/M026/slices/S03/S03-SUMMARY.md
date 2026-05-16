---
id: S03
parent: M026
milestone: M026
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["sonance-desktop/package.json", "sonance-desktop/scripts/build-app.sh", "sonance-desktop/scripts/download-jre.ps1"]
key_decisions:
  - ["Spring Boot serves React static files in production (single port :8080)", "Adoptium Temurin JRE 21 (not full JDK) for minimal bundle size", "Portable dir build as primary target until Developer Mode resolves NSIS issue", "build-app.sh copies versioned JAR to fixed name sonance-server.jar for electron-builder"]
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-05-10T14:04:13.555Z
blocker_discovered: false
---

# S03: Build & Packaging

**electron-builder produces working Sonance.exe portable app bundling Chromium + JRE 21 + Spring Boot JAR + React frontend**

## What Happened

Built the full packaging pipeline: build-app.sh compiles React into Spring Boot static resources then builds the fat JAR. download-jre.ps1 fetches Adoptium Temurin JRE 21. electron-builder bundles everything as extraResources. The portable build (win-unpacked/) works end-to-end: Sonance.exe → loading screen → bundled JRE spawns bundled JAR → health check → app loads at localhost:8080. NSIS installer step is blocked by a Windows symlink privilege issue in electron-builder's winCodeSign cache — requires Developer Mode to resolve.

## Verification

1) build-app.sh: React built, copied to static/, JAR compiled with frontend included. 2) download-jre.ps1: JRE 21.0.11 downloaded and verified. 3) electron-builder: produced dist/win-unpacked/Sonance.exe (180MB). 4) End-to-end: Sonance.exe started, resolved bundled JRE/JAR paths, Spring Boot up in 5.4s, app loaded.

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

NSIS installer requires Windows Developer Mode for symlink privileges in electron-builder winCodeSign cache extraction. Portable build unaffected.

## Follow-ups

None.

## Files Created/Modified

None.
