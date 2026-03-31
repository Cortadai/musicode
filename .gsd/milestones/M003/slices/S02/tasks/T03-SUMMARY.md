---
id: T03
parent: S02
milestone: M003
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/util/CookieUtil.java", "musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java", "musicode-server/src/main/java/com/musicode/config/SecurityConfig.java", "musicode-server/src/main/java/com/musicode/config/WebConfig.java"]
key_decisions: ["CSRF disabled — SameSite=Strict cookies mitigate CSRF for same-origin SPA", "CORS moved from WebConfig to SecurityConfig CorsConfigurationSource for correct filter ordering", "AuthenticationEntryPoint returns 401 JSON instead of Spring Security's default 403", "H2 console allowed through security for dev", "Cookie Secure flag configurable per profile (musicode.cookies.secure)"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn compile — compiles cleanly."
completed_at: 2026-03-31T07:54:02.296Z
blocker_discovered: false
---

# T03: JwtAuthFilter, CookieUtil, and locked-down SecurityFilterChain with 401 entry point and CORS credentials.

> JwtAuthFilter, CookieUtil, and locked-down SecurityFilterChain with 401 entry point and CORS credentials.

## What Happened
---
id: T03
parent: S02
milestone: M003
key_files:
  - musicode-server/src/main/java/com/musicode/util/CookieUtil.java
  - musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
  - musicode-server/src/main/java/com/musicode/config/WebConfig.java
key_decisions:
  - CSRF disabled — SameSite=Strict cookies mitigate CSRF for same-origin SPA
  - CORS moved from WebConfig to SecurityConfig CorsConfigurationSource for correct filter ordering
  - AuthenticationEntryPoint returns 401 JSON instead of Spring Security's default 403
  - H2 console allowed through security for dev
  - Cookie Secure flag configurable per profile (musicode.cookies.secure)
duration: ""
verification_result: passed
completed_at: 2026-03-31T07:54:02.297Z
blocker_discovered: false
---

# T03: JwtAuthFilter, CookieUtil, and locked-down SecurityFilterChain with 401 entry point and CORS credentials.

**JwtAuthFilter, CookieUtil, and locked-down SecurityFilterChain with 401 entry point and CORS credentials.**

## What Happened

CookieUtil creates HttpOnly/SameSite=Strict cookies with configurable Secure flag. Access token cookie at path=/, refresh token at path=/api/auth/refresh. JwtAuthFilter (OncePerRequestFilter) reads access_token cookie, validates JWT, sets SecurityContext. Skips /api/auth/login. SecurityFilterChain: stateless session, CSRF disabled, permit login+refresh, authenticate everything else, custom 401 entry point. CORS via CorsConfigurationSource with credentials support. WebConfig CORS removed to avoid conflict.

## Verification

mvn compile — compiles cleanly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn compile` | 0 | ✅ pass | 4300ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/util/CookieUtil.java`
- `musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java`
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`
- `musicode-server/src/main/java/com/musicode/config/WebConfig.java`


## Deviations
None.

## Known Issues
None.
