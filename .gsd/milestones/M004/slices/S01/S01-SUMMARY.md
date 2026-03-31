---
id: S01
parent: M004
milestone: M004
provides:
  - Modernized DTO layer for S02 to build on
requires:
  []
affects:
  - S02 — builds on modernized DTOs, controllers will change further with @ControllerAdvice
key_files:
  - musicode-server/src/main/java/com/musicode/model/dto/LoginRequest.java
  - musicode-server/src/main/java/com/musicode/model/dto/TokenPair.java
  - musicode-server/src/main/java/com/musicode/model/dto/UserResponse.java
  - musicode-server/src/main/java/com/musicode/util/TokenHashUtil.java
key_decisions:
  - ScanStatus and TrackMetadata kept as Lombok — mutable/builder patterns
  - TokenHashUtil extracted as static utility
patterns_established:
  - Java Records for immutable DTOs, Lombok for mutable entities
  - TokenHashUtil static utility for SHA-256 hashing
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M004/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M004/slices/S01/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T10:06:51.712Z
blocker_discovered: false
---

# S01: Java Modern Idioms

**6 DTOs to Records, TokenHashUtil extracted, var applied \u2014 97 tests green, coverage met.**

## What Happened

Modernized Java code across the backend. Converted 6 DTOs from Lombok classes to Java Records (LoginRequest, CreateUserRequest, UpdateUserRequest, TokenPair, UserResponse, SearchResults). ScanStatus and TrackMetadata kept as Lombok (mutable state, builder). Updated all call sites to Record accessor style. Extracted TokenHashUtil to eliminate SHA-256 hashing duplication between AuthService and RefreshTokenService. Applied var consistently. 97 tests pass, coverage maintained.

## Verification

mvn clean verify \u2014 97 tests, 0 failures, JaCoCo \u226580% coverage met, BUILD SUCCESS.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Extracted TokenHashUtil utility (unplanned but eliminated clear duplication).

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/model/dto/LoginRequest.java` — Record: username, password with @NotBlank
- `musicode-server/src/main/java/com/musicode/model/dto/CreateUserRequest.java` — Record: username, password, role with validation
- `musicode-server/src/main/java/com/musicode/model/dto/UpdateUserRequest.java` — Record: nullable fields for partial updates
- `musicode-server/src/main/java/com/musicode/model/dto/TokenPair.java` — Record: accessToken, refreshToken
- `musicode-server/src/main/java/com/musicode/model/dto/UserResponse.java` — Record: id, username, role, enabled with from() factory
- `musicode-server/src/main/java/com/musicode/model/dto/SearchResults.java` — Record: tracks, albums, artists lists
- `musicode-server/src/main/java/com/musicode/util/TokenHashUtil.java` — SHA-256 hashing static utility extracted from duplication
- `musicode-server/src/main/java/com/musicode/controller/AuthController.java` — Updated Record accessors, uses TokenHashUtil
- `musicode-server/src/main/java/com/musicode/controller/UserController.java` — Updated Record accessors
- `musicode-server/src/main/java/com/musicode/controller/SearchController.java` — List.of() instead of Collections.emptyList()
- `musicode-server/src/main/java/com/musicode/service/AuthService.java` — Uses TokenHashUtil, removed duplicate hashToken
- `musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java` — Uses TokenHashUtil, var, removed duplicate hashToken
