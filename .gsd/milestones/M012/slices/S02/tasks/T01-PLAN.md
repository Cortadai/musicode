---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Wire admin guards and complete lazy routes

Wrap /settings and /users routes in a ProtectedRoute with requiredRole='ADMIN'. Make LoginPage lazy. Verify admin guard by checking ProtectedRoute role logic.

## Inputs

- `App.tsx current route structure`
- `ProtectedRoute requiredRole support`

## Expected Output

- `Admin routes guarded with requiredRole='ADMIN'`
- `LoginPage lazy-loaded`
- `All tests pass`

## Verification

vitest --run && tsc --noEmit
