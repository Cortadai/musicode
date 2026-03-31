---
id: T05
parent: S02
milestone: M003
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/test/java/com/musicode/controller/AuthControllerTest.java", "musicode-server/src/test/java/com/musicode/service/JwtServiceTest.java"]
key_decisions: ["@WithMockUser(roles='LISTENER') for browse/play test classes", "@WithMockUser(roles='ADMIN') for LibraryControllerTest (folder management)", "AuthControllerTest uses real login flow with cookies, not @WithMockUser"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn clean verify — 75 tests, 0 failures, JaCoCo coverage checks met, BUILD SUCCESS."
completed_at: 2026-03-31T07:54:24.711Z
blocker_discovered: false
---

# T05: All 6 existing tests adapted with @WithMockUser + 19 new auth tests — 75 total, green, coverage met.

> All 6 existing tests adapted with @WithMockUser + 19 new auth tests — 75 total, green, coverage met.

## What Happened
---
id: T05
parent: S02
milestone: M003
key_files:
  - musicode-server/src/test/java/com/musicode/controller/AuthControllerTest.java
  - musicode-server/src/test/java/com/musicode/service/JwtServiceTest.java
key_decisions:
  - @WithMockUser(roles='LISTENER') for browse/play test classes
  - @WithMockUser(roles='ADMIN') for LibraryControllerTest (folder management)
  - AuthControllerTest uses real login flow with cookies, not @WithMockUser
duration: ""
verification_result: passed
completed_at: 2026-03-31T07:54:24.712Z
blocker_discovered: false
---

# T05: All 6 existing tests adapted with @WithMockUser + 19 new auth tests — 75 total, green, coverage met.

**All 6 existing tests adapted with @WithMockUser + 19 new auth tests — 75 total, green, coverage met.**

## What Happened

Adapted all 6 existing controller tests with @WithMockUser annotations. Wrote AuthControllerTest (10 tests covering login success/failure, protected endpoint 401, token-authenticated access, refresh rotation, revoked refresh rejection, logout with cookie clearing, /me endpoint). JwtServiceTest (9 tests for generate/validate/extract/expiry). Fixed 403→401 issue by adding custom AuthenticationEntryPoint. Total: 75 tests, all green, JaCoCo ≥80% met.

## Verification

mvn clean verify — 75 tests, 0 failures, JaCoCo coverage checks met, BUILD SUCCESS.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn clean verify` | 0 | ✅ pass | 17700ms |


## Deviations

Added AuthenticationEntryPoint to SecurityConfig to return 401 instead of Spring Security's default 403 for unauthenticated requests.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/controller/AuthControllerTest.java`
- `musicode-server/src/test/java/com/musicode/service/JwtServiceTest.java`


## Deviations
Added AuthenticationEntryPoint to SecurityConfig to return 401 instead of Spring Security's default 403 for unauthenticated requests.

## Known Issues
None.
