---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: AuthContext provider + useAuth hook

Create context/AuthContext.tsx with AuthProvider and useAuth hook. State: user (UserInfo | null), loading (boolean). On mount, call GET /api/auth/me to check existing session. Provides: login(username, password), logout(), user, isAdmin, isAuthenticated, loading. login() calls api login, sets user from response. logout() calls api logout, clears user, navigates to /login. Export useAuth hook.

## Inputs

- `api/auth.ts from T01`
- `types/index.ts`

## Expected Output

- `context/AuthContext.tsx`

## Verification

npm run build — compiles cleanly
