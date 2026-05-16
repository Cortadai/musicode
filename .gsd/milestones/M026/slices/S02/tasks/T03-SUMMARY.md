---
id: T03
parent: S02
milestone: M026
key_files:
  - sonance-desktop/loading.html
  - sonance-desktop/main.js
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T13:52:26.245Z
blocker_discovered: false
---

# T03: Loading screen shown during backend startup, transitions to app on health check pass

**Loading screen shown during backend startup, transitions to app on health check pass**

## What Happened

Created loading.html with Sonance branding, CSS spinner, and 'Starting server...' status text. main.js loads this file immediately on window creation (show:false until ready-to-show), then calls loadURL with the real app after sidecar.start() resolves.

## Verification

Visual confirmation: window shows loading page immediately, then transitions to app URL after sidecar ready signal.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `electron . visual inspection` | 0 | pass | 8000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sonance-desktop/loading.html`
- `sonance-desktop/main.js`
