# M003: 

## Vision
Transform Musicode from an open localhost app into a secure multi-user system ready for NAS deployment. Spring Security with JWT in HttpOnly secure cookies, admin-managed users with roles, protected API endpoints, React auth flow, and Caddy reverse proxy with automatic HTTPS.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | User Model & Foundation | low | — | ✅ | After this: User and RefreshToken entities exist in H2, admin user seeded on startup, UserDetailsService loads users for Spring Security, PasswordEncoder configured. |
| S02 | JWT Auth with Secure Cookies | high | S01 | ✅ | After this: POST /api/auth/login returns access+refresh tokens in HttpOnly cookies. All /api/** endpoints return 401 without valid token. POST /api/auth/refresh rotates tokens. POST /api/auth/logout revokes refresh token server-side. |
| S03 | User Management & Role Enforcement | medium | S02 | ✅ | After this: ADMIN can create/list/update/delete users via API. LISTENER can browse and play but cannot manage library folders or users. Role enforcement tested. |
| S04 | Frontend Auth Flow | medium | S02, S03 | ✅ | After this: React app shows login page when unauthenticated. Login sets cookies, app loads normally. Admin sees user management and settings. Listener sees browse/play only. Token refresh is transparent. Logout clears session. |
| S05 | Caddy Reverse Proxy & HTTPS | low | S04 | ⬜ | After this: docker-compose up starts Caddy + Spring Boot. Browser accesses https://localhost, gets valid TLS, login page loads, full app works through HTTPS. Spring Boot port 8080 not reachable from host. |
