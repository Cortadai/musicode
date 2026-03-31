# S04: Frontend Auth Flow

**Goal:** Complete frontend authentication — login page, auth context, axios interceptor for cookie-based auth with transparent refresh, route guards, role-based UI visibility
**Demo:** After this: After this: React app shows login page when unauthenticated. Login sets cookies, app loads normally. Admin sees user management and settings. Listener sees browse/play only. Token refresh is transparent. Logout clears session.

## Tasks
- [x] **T01: Auth API layer + axios interceptor with 401 refresh queue.** — Add auth types to types/index.ts: UserInfo (id, username, role, enabled), LoginCredentials (username, password). Create api/auth.ts with functions: login(credentials), refresh(), logout(), getMe(). All use the shared axios client. Update api/client.ts: set withCredentials: true on the axios instance (required for cookies to be sent cross-origin in dev proxy). Add response interceptor: on 401, attempt POST /api/auth/refresh, if success retry original request, if refresh fails redirect to /login. Queue concurrent 401s to a single refresh call.
  - Estimate: 20min
  - Files: musicode-ui/src/types/index.ts, musicode-ui/src/api/auth.ts, musicode-ui/src/api/client.ts
  - Verify: npm run build — compiles cleanly
- [x] **T02: AuthContext provider + useAuth hook with session restoration and login/logout.** — Create context/AuthContext.tsx with AuthProvider and useAuth hook. State: user (UserInfo | null), loading (boolean). On mount, call GET /api/auth/me to check existing session. Provides: login(username, password), logout(), user, isAdmin, isAuthenticated, loading. login() calls api login, sets user from response. logout() calls api logout, clears user, navigates to /login. Export useAuth hook.
  - Estimate: 15min
  - Files: musicode-ui/src/context/AuthContext.tsx
  - Verify: npm run build — compiles cleanly
- [x] **T03: Login page, ProtectedRoute, UsersPage, auth-aware routing and sidebar with role-based visibility.** — Create pages/LoginPage.tsx: centered card with username/password inputs, login button, error message display. On submit, call useAuth().login(). On success, navigate to /. Create components/auth/ProtectedRoute.tsx: wraps Outlet, checks useAuth().isAuthenticated, redirects to /login if not. Optional requiredRole prop — redirects to / if role doesn't match. Update App.tsx: wrap all existing routes in ProtectedRoute. Add /login route outside protection. Settings route requires ADMIN role. Add /users route for user management page (ADMIN). Create pages/UsersPage.tsx: list users, create user form, edit/delete. Only visible to ADMIN. Update Sidebar.tsx: show Settings and Users links only when useAuth().isAdmin. Add logout button at bottom of sidebar.
  - Estimate: 30min
  - Files: musicode-ui/src/pages/LoginPage.tsx, musicode-ui/src/components/auth/ProtectedRoute.tsx, musicode-ui/src/pages/UsersPage.tsx, musicode-ui/src/App.tsx, musicode-ui/src/components/layout/Sidebar.tsx
  - Verify: npm run build — compiles cleanly
- [x] **T04: 6 auth tests for refresh queue and role logic — 35 total frontend tests green, coverage met.** — Write tests for auth interceptor refresh queue logic (unit test the queue mechanism). Write tests for AuthContext state transitions: initial loading state, login sets user, logout clears user, isAdmin computed correctly. Verify all existing tests (PlayerContext, format utils) still pass. npm run test:coverage passes.
  - Estimate: 20min
  - Files: musicode-ui/src/context/AuthContext.test.ts, musicode-ui/src/utils/format.test.ts
  - Verify: npm run test:coverage — all tests pass, coverage thresholds met
