---
id: T01
parent: S04
milestone: M003
provides: []
requires: []
affects: []
key_files: ["musicode-ui/src/api/auth.ts", "musicode-ui/src/api/client.ts", "musicode-ui/src/types/index.ts"]
key_decisions: ["withCredentials: true on axios instance for cookie transport", "Refresh queue pattern: concurrent 401s queue behind single refresh call", "window.location.href redirect on refresh failure as fallback"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build — compiles cleanly."
completed_at: 2026-03-31T09:34:07.744Z
blocker_discovered: false
---

# T01: Auth API layer + axios interceptor with 401 refresh queue.

> Auth API layer + axios interceptor with 401 refresh queue.

## What Happened
---
id: T01
parent: S04
milestone: M003
key_files:
  - musicode-ui/src/api/auth.ts
  - musicode-ui/src/api/client.ts
  - musicode-ui/src/types/index.ts
key_decisions:
  - withCredentials: true on axios instance for cookie transport
  - Refresh queue pattern: concurrent 401s queue behind single refresh call
  - window.location.href redirect on refresh failure as fallback
duration: ""
verification_result: passed
completed_at: 2026-03-31T09:34:07.744Z
blocker_discovered: false
---

# T01: Auth API layer + axios interceptor with 401 refresh queue.

**Auth API layer + axios interceptor with 401 refresh queue.**

## What Happened

Added UserInfo and LoginCredentials types. Created auth API functions (login, refresh, logout, getMe). Updated axios client with withCredentials:true and 401 interceptor with refresh queue — concurrent 401s wait for single refresh call, retries or redirects to /login on failure.

## Verification

npm run build — compiles cleanly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 4000ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/api/auth.ts`
- `musicode-ui/src/api/client.ts`
- `musicode-ui/src/types/index.ts`


## Deviations
None.

## Known Issues
None.
