---
id: T04
parent: S02
milestone: M003
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/controller/AuthController.java", "musicode-server/src/main/java/com/musicode/model/dto/LoginRequest.java", "musicode-server/src/main/java/com/musicode/model/dto/UserResponse.java"]
key_decisions: ["Read cookies manually via HttpServletRequest instead of @CookieValue for path-restricted cookies", "UserResponse DTO never exposes passwordHash", "/api/auth/me uses @AuthenticationPrincipal to get username from SecurityContext"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn compile — compiles cleanly."
completed_at: 2026-03-31T07:54:12.487Z
blocker_discovered: false
---

# T04: AuthController with login/refresh/logout/me endpoints, LoginRequest and UserResponse DTOs.

> AuthController with login/refresh/logout/me endpoints, LoginRequest and UserResponse DTOs.

## What Happened
---
id: T04
parent: S02
milestone: M003
key_files:
  - musicode-server/src/main/java/com/musicode/controller/AuthController.java
  - musicode-server/src/main/java/com/musicode/model/dto/LoginRequest.java
  - musicode-server/src/main/java/com/musicode/model/dto/UserResponse.java
key_decisions:
  - Read cookies manually via HttpServletRequest instead of @CookieValue for path-restricted cookies
  - UserResponse DTO never exposes passwordHash
  - /api/auth/me uses @AuthenticationPrincipal to get username from SecurityContext
duration: ""
verification_result: passed
completed_at: 2026-03-31T07:54:12.487Z
blocker_discovered: false
---

# T04: AuthController with login/refresh/logout/me endpoints, LoginRequest and UserResponse DTOs.

**AuthController with login/refresh/logout/me endpoints, LoginRequest and UserResponse DTOs.**

## What Happened

AuthController with 4 endpoints: POST /login (authenticate + set cookies + return user info), POST /refresh (rotate tokens + set new cookies), POST /logout (revoke + clear cookies), GET /me (return current user from SecurityContext). LoginRequest DTO with validation. UserResponse DTO excludes password fields. Refresh endpoint extracts user info from new access token.

## Verification

mvn compile — compiles cleanly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn compile` | 0 | ✅ pass | 6100ms |


## Deviations

Used HttpServletRequest for cookie reading instead of @CookieValue — refresh cookie has restricted path that @CookieValue doesn't reliably pick up.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/controller/AuthController.java`
- `musicode-server/src/main/java/com/musicode/model/dto/LoginRequest.java`
- `musicode-server/src/main/java/com/musicode/model/dto/UserResponse.java`


## Deviations
Used HttpServletRequest for cookie reading instead of @CookieValue — refresh cookie has restricted path that @CookieValue doesn't reliably pick up.

## Known Issues
None.
