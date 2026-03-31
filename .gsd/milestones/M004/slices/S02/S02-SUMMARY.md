---
id: S02
parent: M004
milestone: M004
provides:
  - Consistent error JSON format for S03 frontend ErrorMessage component
requires:
  - slice: S01
    provides: Records and TokenHashUtil
affects:
  []
key_files:
  - musicode-server/src/main/java/com/musicode/exception/GlobalExceptionHandler.java
  - musicode-server/src/main/resources/logback-spring.xml
  - musicode-server/src/main/java/com/musicode/filter/RequestIdFilter.java
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
key_decisions:
  - @ControllerAdvice + SecurityConfig handlers coexist (pre-controller vs in-controller)
  - ConflictException (409) for uniqueness violations
  - logback-spring.xml replaces application.yml logging config
  - 8-char UUID requestId in MDC
patterns_established:
  - GlobalExceptionHandler for consistent error responses
  - Custom exception hierarchy (ResourceNotFound/Conflict/BadRequest)
  - RequestIdFilter with MDC for log correlation
  - logback-spring.xml with profile-aware formatting
observability_surfaces:
  - MDC requestId in every log line
  - X-Request-Id response header
  - Structured error responses with timestamp/path
  - JSON logging in docker profile
drill_down_paths:
  - .gsd/milestones/M004/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M004/slices/S02/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T10:16:49.231Z
blocker_discovered: false
---

# S02: Backend Error Handling, Logging & Comments

**@ControllerAdvice + custom exceptions + logback MDC + didactic comments across security layer — 97 tests green.**

## What Happened

Centralized all backend error handling and added structured logging. GlobalExceptionHandler replaces scattered inline error responses with consistent {status, error, path, timestamp} JSON. Three custom exceptions (ResourceNotFoundException, ConflictException, BadRequestException) replace ResponseEntity.badRequest/notFound patterns in all controllers. logback-spring.xml provides profile-aware formatting: colored readable in dev, JSON structured in docker. RequestIdFilter adds MDC requestId to every request for log correlation. Comprehensive didactic comments added to SecurityConfig (5 architecture decisions), JwtAuthFilter (cookies vs headers, role extraction trade-offs), RefreshTokenService (4 refresh token design decisions), CookieUtil (4 security flag explanations), and GlobalExceptionHandler (why @ControllerAdvice + SecurityConfig handlers coexist).

## Verification

mvn clean verify — 97 tests, 0 failures, JaCoCo ≥80% coverage met, BUILD SUCCESS.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Duplicate resources changed from 400 to 409 (semantically correct). Logging config moved from application.yml to logback-spring.xml.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/exception/GlobalExceptionHandler.java` — Global exception handler: 7 exception types, consistent JSON format
- `musicode-server/src/main/java/com/musicode/exception/ResourceNotFoundException.java` — 404 exception
- `musicode-server/src/main/java/com/musicode/exception/ConflictException.java` — 409 exception
- `musicode-server/src/main/java/com/musicode/exception/BadRequestException.java` — 400 exception
- `musicode-server/src/main/java/com/musicode/exception/ErrorResponse.java` — Consistent error response Record
- `musicode-server/src/main/java/com/musicode/filter/RequestIdFilter.java` — MDC request ID filter
- `musicode-server/src/main/resources/logback-spring.xml` — Profile-aware logging configuration
- `musicode-server/src/main/java/com/musicode/controller/UserController.java` — Refactored to throw custom exceptions + didactic comments
- `musicode-server/src/main/java/com/musicode/controller/LibraryController.java` — Refactored to throw custom exceptions
- `musicode-server/src/main/java/com/musicode/controller/AlbumController.java` — Throws ResourceNotFoundException
- `musicode-server/src/main/java/com/musicode/controller/ArtistController.java` — Throws ResourceNotFoundException
- `musicode-server/src/main/java/com/musicode/controller/TrackController.java` — Throws ResourceNotFoundException
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java` — Didactic comments on 5 architecture decisions
- `musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java` — Didactic comments on cookies vs headers, role extraction
- `musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java` — Didactic comments on 4 design decisions
- `musicode-server/src/main/java/com/musicode/util/CookieUtil.java` — Didactic comments on 4 security flags
- `musicode-server/src/main/java/com/musicode/controller/AuthController.java` — Didactic comments on why login keeps try-catch
- `musicode-server/src/main/resources/application.yml` — Moved logging to logback-spring.xml
- `musicode-server/src/main/resources/application-docker.yml` — Moved logging to logback-spring.xml
- `musicode-server/src/test/java/com/musicode/controller/LibraryControllerTest.java` — Duplicate folder test updated to 409
