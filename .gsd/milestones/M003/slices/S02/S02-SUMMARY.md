---
id: S02
parent: M003
milestone: M003
provides:
  - Auth endpoints for S04 frontend consumption
  - SecurityFilterChain with role-based authorization for S03 to extend
  - @WithMockUser test pattern for S03 tests
  - CookieUtil for S04 frontend auth flow
requires:
  - slice: S01
    provides: User entity, UserRepository, MusicodeUserDetailsService, PasswordEncoder, RefreshToken entity, RefreshTokenRepository
affects:
  - S03 — Role enforcement uses the SecurityFilterChain and @WithMockUser patterns from this slice
  - S04 — Frontend auth consumes the cookies and endpoints from this slice
key_files:
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
  - musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java
  - musicode-server/src/main/java/com/musicode/service/JwtService.java
  - musicode-server/src/main/java/com/musicode/service/AuthService.java
  - musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java
  - musicode-server/src/main/java/com/musicode/util/CookieUtil.java
  - musicode-server/src/main/java/com/musicode/controller/AuthController.java
key_decisions:
  - JJWT 0.12.6 with HS256 signing
  - CSRF disabled — SameSite=Strict mitigates (D015)
  - CORS in SecurityConfig, not WebConfig
  - 401 via custom AuthenticationEntryPoint
  - Opaque UUID refresh tokens hashed with SHA-256
  - Revoked token reuse triggers full user token revocation (theft detection)
patterns_established:
  - JWT in HttpOnly/SameSite=Strict cookies (no localStorage)
  - Opaque refresh tokens with SHA-256 hashing and rotation on use
  - Theft detection: revoked token reuse revokes all user tokens
  - @WithMockUser for existing controller tests under security
  - Custom AuthenticationEntryPoint for 401 JSON responses
observability_surfaces:
  - Failed auth logged with username
  - Refresh token revocation logged with username
  - Expired token cleanup count logged hourly
drill_down_paths:
  - .gsd/milestones/M003/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S02/tasks/T02-SUMMARY.md
  - .gsd/milestones/M003/slices/S02/tasks/T03-SUMMARY.md
  - .gsd/milestones/M003/slices/S02/tasks/T04-SUMMARY.md
  - .gsd/milestones/M003/slices/S02/tasks/T05-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T07:55:21.439Z
blocker_discovered: false
---

# S02: JWT Auth with Secure Cookies

**JWT auth with secure cookies fully implemented \u2014 login/refresh/logout, filter chain locked down, 19 new tests, 75 total green.**

## What Happened

Built the complete JWT auth system for Musicode. JwtService generates access tokens (15min) and refresh JWTs (7 days) with HS256 signing via JJWT 0.12.6. RefreshTokenService manages opaque UUID refresh tokens: creates (UUID → SHA-256 hash → persist), validates and rotates (revoke old, issue new), and implements theft detection (revoked token reuse triggers full user revocation). AuthService orchestrates login via Spring's AuthenticationManager, refresh with rotation, and logout with revocation. CookieUtil creates HttpOnly/SameSite=Strict cookies with profile-aware Secure flag. JwtAuthFilter (OncePerRequestFilter) reads access_token cookie, validates JWT, and sets SecurityContext. SecurityFilterChain locked down: stateless sessions, CSRF disabled (SameSite=Strict mitigates), permit login+refresh, authenticate everything else, custom 401 JSON entry point. CORS moved from WebConfig to SecurityConfig CorsConfigurationSource for correct filter ordering. AuthController exposes login/refresh/logout/me endpoints. All 6 existing controller tests adapted with @WithMockUser. 19 new auth tests (AuthControllerTest + JwtServiceTest). Total: 75 tests, all green, JaCoCo ≥80% enforced.

## Verification

mvn clean verify \u2014 75 tests, 0 failures, JaCoCo \u226580% coverage met, BUILD SUCCESS.

## Requirements Advanced

- R017 — Full JWT auth system with secure cookies, login/refresh/logout, stateless sessions, and token revocation

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Added AuthenticationEntryPoint for 401 instead of default 403. Used HttpServletRequest for cookie reading instead of @CookieValue due to path-restricted refresh cookie.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `musicode-server/pom.xml` — Added JJWT 0.12.6 dependencies (api, impl, jackson)
- `musicode-server/src/main/resources/application.yml` — Added JWT secret, expiration, and cookie secure flag config
- `musicode-server/src/test/resources/application-test.yml` — Added JWT and cookie config for test profile
- `musicode-server/src/main/java/com/musicode/service/JwtService.java` — JWT generation, validation, claim extraction with HS256
- `musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java` — Refresh token lifecycle: create, validate/rotate, revoke, cleanup
- `musicode-server/src/main/java/com/musicode/service/AuthService.java` — Login/refresh/logout orchestration
- `musicode-server/src/main/java/com/musicode/util/CookieUtil.java` — HttpOnly/SameSite/Secure cookie creation and clearing
- `musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java` — OncePerRequestFilter reading access_token cookie, setting SecurityContext
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java` — Locked-down filter chain: stateless, JWT filter, CORS, 401 entry point
- `musicode-server/src/main/java/com/musicode/config/WebConfig.java` — CORS removed (moved to SecurityConfig)
- `musicode-server/src/main/java/com/musicode/config/AsyncConfig.java` — Added @EnableScheduling for token cleanup
- `musicode-server/src/main/java/com/musicode/controller/AuthController.java` — Login/refresh/logout/me endpoints
- `musicode-server/src/main/java/com/musicode/model/dto/LoginRequest.java` — Login request DTO with validation
- `musicode-server/src/main/java/com/musicode/model/dto/UserResponse.java` — User response DTO (no password)
- `musicode-server/src/main/java/com/musicode/model/dto/TokenPair.java` — Access/refresh pair DTO
- `musicode-server/src/test/java/com/musicode/controller/AlbumControllerTest.java` — Added @WithMockUser(LISTENER)
- `musicode-server/src/test/java/com/musicode/controller/ArtistControllerTest.java` — Added @WithMockUser(LISTENER)
- `musicode-server/src/test/java/com/musicode/controller/TrackControllerTest.java` — Added @WithMockUser(LISTENER)
- `musicode-server/src/test/java/com/musicode/controller/SearchControllerTest.java` — Added @WithMockUser(LISTENER)
- `musicode-server/src/test/java/com/musicode/controller/LibraryControllerTest.java` — Added @WithMockUser(ADMIN)
- `musicode-server/src/test/java/com/musicode/controller/CoverArtControllerTest.java` — Added @WithMockUser(LISTENER)
- `musicode-server/src/test/java/com/musicode/controller/AuthControllerTest.java` — 10 auth flow tests: login, 401, cookies, refresh rotation, logout
- `musicode-server/src/test/java/com/musicode/service/JwtServiceTest.java` — 9 JWT tests: generate, validate, extract, expiry
