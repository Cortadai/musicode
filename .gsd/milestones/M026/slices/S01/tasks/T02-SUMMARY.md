---
id: T02
parent: S01
milestone: M026
key_files:
  - sonance-desktop/package.json
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T13:47:23.364Z
blocker_discovered: false
---

# T02: Dev workflow with concurrently — single `npm run dev` starts vite + Electron with wait-on

**Dev workflow with concurrently — single `npm run dev` starts vite + Electron with wait-on**

## What Happened

Package.json scripts use concurrently --kill-others to run dev:ui (vite on 5173) and dev:electron (wait-on http://localhost:5173 then electron .). Both processes start and stop together cleanly. .gitignore covers node_modules/, dist/, out/, jre/.

## Verification

Ran `npm run dev` — vite started first, wait-on detected it, Electron launched and loaded the UI. Both killed cleanly on timeout (exit 143). No orphan processes.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run dev (timeout 15s)` | 0 | pass | 15000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `sonance-desktop/package.json`
