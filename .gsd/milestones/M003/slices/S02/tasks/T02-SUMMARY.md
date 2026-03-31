---
id: T02
parent: S02
milestone: M003
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java", "musicode-server/src/main/java/com/musicode/service/AuthService.java", "musicode-server/src/main/java/com/musicode/model/dto/TokenPair.java"]
key_decisions: ["Refresh tokens are opaque UUIDs, hashed with SHA-256 before storage", "Token rotation: old token revoked when refresh succeeds, new one issued", "Reuse of revoked token triggers revocation of ALL user tokens (theft detection)", "@Scheduled cleanup every hour for expired tokens"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn compile — compiles cleanly."
completed_at: 2026-03-31T07:53:50.466Z
blocker_discovered: false
---

# T02: AuthService + RefreshTokenService with login/refresh/logout flows, SHA-256 token hashing, rotation, and theft detection.

> AuthService + RefreshTokenService with login/refresh/logout flows, SHA-256 token hashing, rotation, and theft detection.

## What Happened
---
id: T02
parent: S02
milestone: M003
key_files:
  - musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java
  - musicode-server/src/main/java/com/musicode/service/AuthService.java
  - musicode-server/src/main/java/com/musicode/model/dto/TokenPair.java
key_decisions:
  - Refresh tokens are opaque UUIDs, hashed with SHA-256 before storage
  - Token rotation: old token revoked when refresh succeeds, new one issued
  - Reuse of revoked token triggers revocation of ALL user tokens (theft detection)
  - @Scheduled cleanup every hour for expired tokens
duration: ""
verification_result: passed
completed_at: 2026-03-31T07:53:50.466Z
blocker_discovered: false
---

# T02: AuthService + RefreshTokenService with login/refresh/logout flows, SHA-256 token hashing, rotation, and theft detection.

**AuthService + RefreshTokenService with login/refresh/logout flows, SHA-256 token hashing, rotation, and theft detection.**

## What Happened

RefreshTokenService handles token lifecycle: create (UUID + SHA-256 hash), validateAndRotate (checks expiry/revoked, revokes old, issues new), revokeByRawToken, revokeAllForUser. Revoked token reuse triggers full revocation for the user. AuthService orchestrates login (AuthenticationManager + token generation), refresh (validate + rotate + new access token), and logout (revoke). @EnableScheduling added to AsyncConfig for hourly cleanup.

## Verification

mvn compile — compiles cleanly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn compile` | 0 | ✅ pass | 4200ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java`
- `musicode-server/src/main/java/com/musicode/service/AuthService.java`
- `musicode-server/src/main/java/com/musicode/model/dto/TokenPair.java`


## Deviations
None.

## Known Issues
None.
