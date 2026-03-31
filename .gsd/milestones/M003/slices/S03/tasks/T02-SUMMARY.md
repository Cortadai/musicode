---
id: T02
parent: S03
milestone: M003
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/config/SecurityConfig.java"]
key_decisions: ["Library GET endpoints (folders, scan status) open to any authenticated user", "Library mutating endpoints (POST/DELETE folders, scan, cleanup) restricted to ADMIN", "Custom AccessDeniedHandler returns 403 JSON instead of Spring's default HTML"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn compile — compiles cleanly."
completed_at: 2026-03-31T09:22:05.109Z
blocker_discovered: false
---

# T02: SecurityFilterChain updated with ADMIN-only rules for user management and library mutations, 403 JSON handler.

> SecurityFilterChain updated with ADMIN-only rules for user management and library mutations, 403 JSON handler.

## What Happened
---
id: T02
parent: S03
milestone: M003
key_files:
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
key_decisions:
  - Library GET endpoints (folders, scan status) open to any authenticated user
  - Library mutating endpoints (POST/DELETE folders, scan, cleanup) restricted to ADMIN
  - Custom AccessDeniedHandler returns 403 JSON instead of Spring's default HTML
duration: ""
verification_result: passed
completed_at: 2026-03-31T09:22:05.109Z
blocker_discovered: false
---

# T02: SecurityFilterChain updated with ADMIN-only rules for user management and library mutations, 403 JSON handler.

**SecurityFilterChain updated with ADMIN-only rules for user management and library mutations, 403 JSON handler.**

## What Happened

Updated SecurityFilterChain with granular role-based rules: /api/users/** ADMIN only, library mutation endpoints ADMIN only, library read endpoints any authenticated, browse/stream/search/covers any authenticated. Added custom AccessDeniedHandler returning 403 JSON.

## Verification

mvn compile — compiles cleanly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn compile` | 0 | ✅ pass | 4600ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`


## Deviations
None.

## Known Issues
None.
