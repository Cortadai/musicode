# S02: JWT Auth with Secure Cookies

**Goal:** Implement the core auth mechanism — JWT generation/validation, cookie management, Spring Security filter chain, login/refresh/logout endpoints
**Demo:** After this: After this: POST /api/auth/login returns access+refresh tokens in HttpOnly cookies. All /api/** endpoints return 401 without valid token. POST /api/auth/refresh rotates tokens. POST /api/auth/logout revokes refresh token server-side.

## Tasks
