---
id: T03
parent: S03
milestone: M003
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/test/java/com/musicode/controller/UserControllerTest.java", "musicode-server/src/test/java/com/musicode/controller/LibraryControllerTest.java"]
key_decisions: ["Principal.getName() for username extraction in controllers — works with both @WithMockUser and JWT filter", "Method-level @WithMockUser(roles='LISTENER') on specific tests to override class-level ADMIN"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn clean verify — 97 tests, 0 failures, JaCoCo ≥80% coverage met, BUILD SUCCESS."
completed_at: 2026-03-31T09:22:16.841Z
blocker_discovered: false
---

# T03: 16 UserController tests + 6 library role tests = 22 new tests, 97 total, green, coverage met.

> 16 UserController tests + 6 library role tests = 22 new tests, 97 total, green, coverage met.

## What Happened
---
id: T03
parent: S03
milestone: M003
key_files:
  - musicode-server/src/test/java/com/musicode/controller/UserControllerTest.java
  - musicode-server/src/test/java/com/musicode/controller/LibraryControllerTest.java
key_decisions:
  - Principal.getName() for username extraction in controllers — works with both @WithMockUser and JWT filter
  - Method-level @WithMockUser(roles='LISTENER') on specific tests to override class-level ADMIN
duration: ""
verification_result: passed
completed_at: 2026-03-31T09:22:16.841Z
blocker_discovered: false
---

# T03: 16 UserController tests + 6 library role tests = 22 new tests, 97 total, green, coverage met.

**16 UserController tests + 6 library role tests = 22 new tests, 97 total, green, coverage met.**

## What Happened

UserControllerTest: 16 tests covering CRUD success/failure, validation, duplicate handling, self-deletion prevention, and LISTENER 403 enforcement. LibraryControllerTest: 6 new role enforcement tests — listener can GET folders/scan status but gets 403 on POST/DELETE folders, scan, and cleanup. Fixed @AuthenticationPrincipal to java.security.Principal for compatibility with @WithMockUser. Total: 97 tests, all green, JaCoCo ≥80%.

## Verification

mvn clean verify — 97 tests, 0 failures, JaCoCo ≥80% coverage met, BUILD SUCCESS.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn clean verify` | 0 | ✅ pass | 20600ms |


## Deviations

Used java.security.Principal instead of @AuthenticationPrincipal String \u2014 @WithMockUser sets principal as UserDetails object, not plain String. Principal.getName() works with both @WithMockUser and real JWT auth.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/controller/UserControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/LibraryControllerTest.java`


## Deviations
Used java.security.Principal instead of @AuthenticationPrincipal String \u2014 @WithMockUser sets principal as UserDetails object, not plain String. Principal.getName() works with both @WithMockUser and real JWT auth.

## Known Issues
None.
