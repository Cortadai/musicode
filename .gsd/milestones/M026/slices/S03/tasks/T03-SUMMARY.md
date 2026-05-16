---
id: T03
parent: S03
milestone: M026
key_files:
  - sonance-desktop/package.json
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T14:03:53.078Z
blocker_discovered: false
---

# T03: electron-builder produces working Sonance.exe portable build (NSIS blocked by Windows symlink issue)

**electron-builder produces working Sonance.exe portable build (NSIS blocked by Windows symlink issue)**

## What Happened

Configured electron-builder with appId, productName, extraResources (JAR + JRE), files list, and NSIS+dir targets. The `dir` target produces a working win-unpacked/ folder with Sonance.exe. NSIS installer step is blocked by a known electron-builder issue: winCodeSign cache extraction fails creating macOS symlinks on Windows without Developer Mode. Portable build verified end-to-end.

## Verification

Sonance.exe from dist/win-unpacked/ launches, starts bundled JRE+JAR, health check passes, app loads. NSIS step requires Developer Mode — documented as known issue.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `electron-builder --dir (partial)` | 0 | pass | 60000ms |
| 2 | `Sonance.exe end-to-end` | 0 | pass | 30000ms |

## Deviations

None.

## Known Issues

NSIS installer build requires Windows Developer Mode enabled (for symlink privileges in electron-builder winCodeSign cache). Portable dir build works without it.

## Files Created/Modified

- `sonance-desktop/package.json`
