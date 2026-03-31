---
id: M003
title: "Security & Multi-User"
status: complete
completed_at: 2026-03-31T09:52:37.497Z
key_decisions:
  - D013: H2 table for refresh tokens (Redis deferred)
  - D014: Spring Security standalone (Keycloak deferred)
  - D015: CSRF disabled, SameSite=Strict mitigates
  - D016: DTOs to Records in cleanup task
  - JJWT 0.12.6 with HS256 for JWT
  - Opaque UUID refresh tokens with SHA-256 hash and rotation
  - Caddy replaces nginx as reverse proxy + static server
  - CORS in SecurityConfig, not WebConfig
  - java.security.Principal for username in controllers
key_files:
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
  - musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java
  - musicode-server/src/main/java/com/musicode/service/JwtService.java
  - musicode-server/src/main/java/com/musicode/service/AuthService.java
  - musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java
  - musicode-server/src/main/java/com/musicode/controller/AuthController.java
  - musicode-server/src/main/java/com/musicode/controller/UserController.java
  - musicode-server/src/main/java/com/musicode/model/entity/User.java
  - musicode-server/src/main/java/com/musicode/model/entity/RefreshToken.java
  - musicode-ui/src/context/AuthContext.tsx
  - musicode-ui/src/api/client.ts
  - musicode-ui/src/pages/LoginPage.tsx
  - musicode-ui/src/components/auth/ProtectedRoute.tsx
  - Caddyfile
  - docker-compose.yml
lessons_learned:
  - Spring Security returns 403 by default for unauthenticated — need custom AuthenticationEntryPoint for 401
  - @WithMockUser sets principal as UserDetails object, not String — use Principal.getName() in controllers
  - Caddyfile handle block ordering matters — API handle before file_server or POST gets 405
  - Spring placeholder syntax uses : for defaults, not :- (both work in Spring Boot but : is canonical)
  - Caddy on localhost auto-generates TLS with internal CA — zero config for dev
---

# M003: Security & Multi-User

**Musicode secured with JWT auth in secure cookies, admin-managed multi-user with roles, and Caddy HTTPS — ready for NAS deployment.**

## What Happened

Transformed Musicode from an open localhost app into a secure multi-user system. S01 built the auth foundation: User/RefreshToken entities, UserDetailsService, admin seed, BCrypt encoder. S02 was the high-risk slice — JWT with JJWT 0.12.6, stateless filter chain, secure cookies (HttpOnly/SameSite=Strict), refresh token rotation with theft detection, login/refresh/logout endpoints. S03 added user CRUD for ADMIN and role-based endpoint security (ADMIN for mutations, any auth for browse/stream). S04 built the React auth flow: axios interceptor with refresh queue for concurrent 401s, AuthContext with session restoration, login page, route guards, role-based sidebar. S05 added Caddy as TLS-terminating reverse proxy, replacing nginx, serving React and proxying API — HTTPS on localhost with zero config. All existing M001/M002 functionality works behind auth. 97 backend tests + 35 frontend tests, all coverage gates met.

## Success Criteria Results

- ✅ All API endpoints except login return 401 without token\n- ✅ Access token 15min in HttpOnly/Secure/SameSite=Strict, refresh 7 days with path restriction\n- ✅ Logout invalidates refresh token server-side\n- ✅ ADMIN CRUDs users, LISTENER browses/plays only\n- ✅ Library management restricted to ADMIN\n- ✅ React login page, transparent refresh, route guards\n- ✅ Caddy terminates TLS, Spring Boot not exposed externally\n- ✅ All existing tests pass, new security tests cover auth and roles\n- ✅ Coverage gates maintained (≥80%)

## Definition of Done Results

- ✅ All 5 slices complete with summaries and UAT artifacts\n- ✅ mvn clean verify BUILD SUCCESS — 97 tests, JaCoCo ≥80%\n- ✅ npm run test:coverage — 35 tests, coverage thresholds met\n- ✅ docker-compose up serves via HTTPS through Caddy\n- ✅ No existing functionality broken — browse, play, seek, scan all work behind auth\n- ✅ DECISIONS.md updated with D013-D016 (security decisions)

## Requirement Outcomes

R017 (Authentication) → validated: JWT + secure cookies + refresh rotation + frontend interceptor\nR018 (Multi-user roles) → validated: ADMIN/LISTENER, CRUD, role enforcement on all endpoints\nR019 (HTTPS) → validated: Caddy TLS termination, HTTP redirect, port isolation\nR001-R009 → remain validated, all work behind auth

## Deviations

None.

## Follow-ups

None.
