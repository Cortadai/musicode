---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: Auth API layer + axios interceptor

Add auth types to types/index.ts: UserInfo (id, username, role, enabled), LoginCredentials (username, password). Create api/auth.ts with functions: login(credentials), refresh(), logout(), getMe(). All use the shared axios client. Update api/client.ts: set withCredentials: true on the axios instance (required for cookies to be sent cross-origin in dev proxy). Add response interceptor: on 401, attempt POST /api/auth/refresh, if success retry original request, if refresh fails redirect to /login. Queue concurrent 401s to a single refresh call.

## Inputs

- `Current api/client.ts`
- `Current types/index.ts`
- `Backend AuthController endpoints`

## Expected Output

- `Updated types/index.ts`
- `api/auth.ts`
- `Updated api/client.ts with interceptor`

## Verification

npm run build — compiles cleanly
