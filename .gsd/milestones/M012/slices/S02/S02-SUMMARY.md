---
id: S02
parent: M012
milestone: M012
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-ui/src/App.tsx"]
key_decisions:
  - ["AlbumsPage stays eager — it's the landing page, lazy-loading it would add a visible spinner on every app load"]
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-18T18:30:39.581Z
blocker_discovered: false
---

# S02: Lazy routes and role-based guards

**Admin routes guarded with requiredRole='ADMIN', LoginPage lazy-loaded — all pages except AlbumsPage now code-split**

## What Happened

The ProtectedRoute component already supported requiredRole but it wasn't wired to admin routes. Moved /settings and /users into a separate ProtectedRoute group with requiredRole='ADMIN'. Non-admin users get redirected to / if they navigate directly. The sidebar already hid admin links behind isAdmin, so the UX was already correct — this adds the route-level enforcement.

LoginPage made lazy to complete code-splitting. AlbumsPage stays eager as the landing page — it's what users see first, so it should load immediately.

## Verification

vitest --run: 109/109 pass. tsc --noEmit: clean.

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

None.

## Follow-ups

None.

## Files Created/Modified

None.
