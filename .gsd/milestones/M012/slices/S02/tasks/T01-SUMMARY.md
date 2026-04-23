---
id: T01
parent: S02
milestone: M012
key_files:
  - musicode-ui/src/App.tsx
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T18:30:23.709Z
blocker_discovered: false
---

# T01: Wired requiredRole='ADMIN' guard on /settings and /users, lazy-loaded LoginPage

**Wired requiredRole='ADMIN' guard on /settings and /users, lazy-loaded LoginPage**

## What Happened

Admin routes (/settings, /users) moved into their own ProtectedRoute wrapper with requiredRole='ADMIN'. This creates two route groups: authenticated (any user) and admin-only. The sidebar already gated admin nav links behind isAdmin — the route guard now provides server-side-equivalent protection at the router level. LoginPage made lazy to complete code-splitting coverage (was the only eager page besides AlbumsPage, which stays eager as the landing page).

## Verification

vitest --run: 109/109 pass. tsc --noEmit: clean. Sidebar already hides admin links for non-admin users.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest --run` | 0 | pass | 3000ms |
| 2 | `npx tsc --noEmit` | 0 | pass | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/App.tsx`
