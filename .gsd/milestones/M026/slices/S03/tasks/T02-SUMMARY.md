---
id: T02
parent: S03
milestone: M026
key_files:
  - sonance-desktop/scripts/download-jre.ps1
  - sonance-desktop/package.json
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T14:03:47.019Z
blocker_discovered: false
---

# T02: JRE 21 downloaded via Adoptium API script, bundled as extraResource

**JRE 21 downloaded via Adoptium API script, bundled as extraResource**

## What Happened

Created download-jre.ps1 that fetches Adoptium Temurin JRE 21 for Windows x64, extracts to sonance-desktop/jre/. Electron-builder config bundles it as extraResource at resources/jre/. Verified: packaged exe correctly resolves jre/bin/java.exe path.

## Verification

Script downloaded JRE 21.0.11+10. Packaged exe used resources/jre/bin/java.exe to start Spring Boot successfully.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `download-jre.ps1` | 0 | pass | 15000ms |
| 2 | `Sonance.exe resolves bundled JRE path` | 0 | pass | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sonance-desktop/scripts/download-jre.ps1`
- `sonance-desktop/package.json`
