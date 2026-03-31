---
id: T01
parent: S02
milestone: M004
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/exception/GlobalExceptionHandler.java", "musicode-server/src/main/java/com/musicode/exception/ResourceNotFoundException.java", "musicode-server/src/main/java/com/musicode/exception/ConflictException.java", "musicode-server/src/main/java/com/musicode/exception/BadRequestException.java", "musicode-server/src/main/java/com/musicode/exception/ErrorResponse.java"]
key_decisions: ["ErrorResponse as Record with factory method", "SecurityConfig entry point + access denied handler kept alongside @ControllerAdvice (pre-controller vs in-controller errors)", "AuthController login keeps try-catch (needs cookie headers on success path)", "Duplicate resources throw ConflictException (409) not BadRequestException (400)"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn clean verify — 97 tests pass, coverage ≥80%."
completed_at: 2026-03-31T10:16:06.484Z
blocker_discovered: false
---

# T01: @ControllerAdvice with 3 custom exceptions, all controllers refactored — 97 tests green.

> @ControllerAdvice with 3 custom exceptions, all controllers refactored — 97 tests green.

## What Happened
---
id: T01
parent: S02
milestone: M004
key_files:
  - musicode-server/src/main/java/com/musicode/exception/GlobalExceptionHandler.java
  - musicode-server/src/main/java/com/musicode/exception/ResourceNotFoundException.java
  - musicode-server/src/main/java/com/musicode/exception/ConflictException.java
  - musicode-server/src/main/java/com/musicode/exception/BadRequestException.java
  - musicode-server/src/main/java/com/musicode/exception/ErrorResponse.java
key_decisions:
  - ErrorResponse as Record with factory method
  - SecurityConfig entry point + access denied handler kept alongside @ControllerAdvice (pre-controller vs in-controller errors)
  - AuthController login keeps try-catch (needs cookie headers on success path)
  - Duplicate resources throw ConflictException (409) not BadRequestException (400)
duration: ""
verification_result: passed
completed_at: 2026-03-31T10:16:06.485Z
blocker_discovered: false
---

# T01: @ControllerAdvice with 3 custom exceptions, all controllers refactored — 97 tests green.

**@ControllerAdvice with 3 custom exceptions, all controllers refactored — 97 tests green.**

## What Happened

Created GlobalExceptionHandler (@RestControllerAdvice) handling 7 exception types with consistent {status, error, path, timestamp} JSON format. Custom exceptions: ResourceNotFoundException (404), ConflictException (409), BadRequestException (400). Refactored all controllers to throw exceptions instead of returning inline ResponseEntity errors. ErrorResponse as a Java Record. Controllers are now cleaner — business logic without error formatting. Tests updated for 409 on duplicates.

## Verification

mvn clean verify — 97 tests pass, coverage ≥80%.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn clean verify` | 0 | ✅ pass | 22200ms |


## Deviations

Duplicate folder test updated from 400 to 409 (ConflictException is semantically correct for uniqueness violations).

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/exception/GlobalExceptionHandler.java`
- `musicode-server/src/main/java/com/musicode/exception/ResourceNotFoundException.java`
- `musicode-server/src/main/java/com/musicode/exception/ConflictException.java`
- `musicode-server/src/main/java/com/musicode/exception/BadRequestException.java`
- `musicode-server/src/main/java/com/musicode/exception/ErrorResponse.java`


## Deviations
Duplicate folder test updated from 400 to 409 (ConflictException is semantically correct for uniqueness violations).

## Known Issues
None.
