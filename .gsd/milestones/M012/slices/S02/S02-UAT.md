# S02: Lazy routes and role-based guards — UAT

**Milestone:** M012
**Written:** 2026-04-18T18:30:39.581Z

## UAT: S02 — Lazy routes and role-based guards

### Pre-conditions
- App running, admin user and non-admin user available

### Test Cases

#### TC1: Admin guard enforcement
1. Log in as non-admin user (LISTENER role)
2. Navigate directly to `/settings` in URL bar
3. Verify redirect to `/`
4. Navigate directly to `/users`
5. Verify redirect to `/`
- **Pass criteria:** Non-admin users cannot access admin pages

#### TC2: Admin access works
1. Log in as admin user
2. Navigate to `/settings` → page loads
3. Navigate to `/users` → page loads
- **Pass criteria:** Admin users access admin pages normally

#### TC3: Lazy loading visible
1. Open browser DevTools → Network tab
2. Navigate to `/search` → verify chunk loaded on-demand
3. Navigate to `/stats` → verify separate chunk
- **Pass criteria:** Network shows JS chunks loading on navigation, not upfront

#### TC4: Sidebar link visibility
1. Log in as non-admin → Settings and Users links not visible in sidebar
2. Log in as admin → Settings and Users links visible
- **Pass criteria:** Sidebar matches role permissions
