# S02: Lazy routes and role-based guards

**Goal:** Enforce role-based guards on admin routes (/settings, /users) and complete lazy loading coverage. ProtectedRoute already supports requiredRole but it's not wired up for admin routes.
**Demo:** Network tab shows chunked loading on first navigation to Settings/Search/etc. Non-admin user redirected away from /settings.

## Must-Haves

- 1. /settings and /users require ADMIN role — non-admin users redirected to /
- 2. LoginPage lazy-loaded (completes the lazy coverage)
- 3. All frontend tests pass
- 4. TypeScript compiles clean

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Wire admin guards and complete lazy routes** `est:15min`
  Wrap /settings and /users routes in a ProtectedRoute with requiredRole='ADMIN'. Make LoginPage lazy. Verify admin guard by checking ProtectedRoute role logic.
  - Files: `musicode-ui/src/App.tsx`
  - Verify: vitest --run && tsc --noEmit

## Files Likely Touched

- musicode-ui/src/App.tsx
