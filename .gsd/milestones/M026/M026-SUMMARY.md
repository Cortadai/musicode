---
id: M026
title: "Electron Desktop Packaging"
status: complete
completed_at: 2026-05-16T14:47:13.922Z
key_decisions:
  - (none)
key_files:
  - sonance-desktop/main.js
  - sonance-desktop/sidecar.js
  - sonance-desktop/package.json
lessons_learned:
  - electron-builder auto-publish must be disabled for manual release workflows — use --publish never
---

# M026: Electron Desktop Packaging

**Packaged Sonance as a standalone Electron desktop app with embedded JRE and auto-managed backend.**

## What Happened

Created Electron wrapper that bundles the Spring Boot JAR with a portable JRE, manages the backend lifecycle (start on launch, kill on quit), serves the UI via BrowserWindow pointing at localhost, and packages via electron-builder for Windows. Includes loading screen, graceful shutdown, and sidecar health checks.

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

None.

## Follow-ups

None.
