---
estimated_steps: 1
estimated_files: 5
skills_used: []
---

# T03: Login page, routes, user management, sidebar auth

Create pages/LoginPage.tsx: centered card with username/password inputs, login button, error message display. On submit, call useAuth().login(). On success, navigate to /. Create components/auth/ProtectedRoute.tsx: wraps Outlet, checks useAuth().isAuthenticated, redirects to /login if not. Optional requiredRole prop — redirects to / if role doesn't match. Update App.tsx: wrap all existing routes in ProtectedRoute. Add /login route outside protection. Settings route requires ADMIN role. Add /users route for user management page (ADMIN). Create pages/UsersPage.tsx: list users, create user form, edit/delete. Only visible to ADMIN. Update Sidebar.tsx: show Settings and Users links only when useAuth().isAdmin. Add logout button at bottom of sidebar.

## Inputs

- `AuthContext from T02`
- `Current App.tsx`
- `Current Sidebar.tsx`

## Expected Output

- `pages/LoginPage.tsx`
- `components/auth/ProtectedRoute.tsx`
- `pages/UsersPage.tsx`
- `Updated App.tsx`
- `Updated Sidebar.tsx`

## Verification

npm run build — compiles cleanly
