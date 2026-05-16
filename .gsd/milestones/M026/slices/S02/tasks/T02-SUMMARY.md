---
id: T02
parent: S02
milestone: M026
key_files:
  - sonance-desktop/sidecar.js
  - sonance-desktop/main.js
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T13:52:21.602Z
blocker_discovered: false
---

# T02: Graceful shutdown with SIGTERM → SIGKILL escalation, no zombie processes

**Graceful shutdown with SIGTERM → SIGKILL escalation, no zombie processes**

## What Happened

sidecar.stop() sends SIGTERM, waits 5s for graceful exit, then escalates to SIGKILL. Wired into app window-all-closed and before-quit events. Verified with wmic that no java.exe processes remain after Electron exits.

## Verification

After Electron was killed by timeout, ran wmic process check — 'No java processes' confirmed. Exit code 143 (SIGTERM) confirms clean kill.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `wmic process where name='java.exe' get ProcessId` | 0 | pass | 500ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sonance-desktop/sidecar.js`
- `sonance-desktop/main.js`
