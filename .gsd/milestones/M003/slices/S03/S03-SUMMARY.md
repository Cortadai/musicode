---
id: S03
parent: M003
milestone: M003
provides:
  - UserController endpoints for S04 admin user management page
  - Role-based security rules for S04 route guards
requires:
  - slice: S01
    provides: User entity, UserRepository, PasswordEncoder
  - slice: S02
    provides: SecurityFilterChain, UserResponse DTO, @WithMockUser test patterns
affects:
  - S04 — Frontend uses roles from /api/auth/me to show/hide admin UI and user management page
key_files:
  - musicode-server/src/main/java/com/musicode/controller/UserController.java
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
key_decisions:
  - java.security.Principal for username extraction in controllers
  - Library GET endpoints open to any authenticated, mutations ADMIN only
  - Custom 403 JSON AccessDeniedHandler
  - Admin self-deletion prevented
patterns_established:
  - java.security.Principal for current user in controllers (works with @WithMockUser and JWT)
  - Method-level @WithMockUser override for role enforcement tests
observability_surfaces:
  - User CRUD operations logged with username
  - 403 responses via AccessDeniedHandler
drill_down_paths:
  - .gsd/milestones/M003/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M003/slices/S03/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T09:22:47.118Z
blocker_discovered: false
---

# S03: User Management & Role Enforcement

**UserController CRUD for ADMIN, role-based endpoint security, 22 new tests \u2014 97 total green, coverage met.**

## What Happened

Built user management CRUD and role enforcement. UserController provides full CRUD for admin-managed users: list, get, create (with validation + uniqueness check), update (partial — username/role/enabled/password), and delete (with self-deletion prevention). SecurityFilterChain updated with granular role rules: /api/users/** ADMIN only, library mutations ADMIN only, library reads and browse/stream/search open to any authenticated user. Custom AccessDeniedHandler returns 403 JSON. 22 new tests (16 UserControllerTest, 6 LibraryControllerTest role enforcement). Total: 97 tests, all green, JaCoCo ≥80%.

## Verification

mvn clean verify \u2014 97 tests, 0 failures, JaCoCo \u226580% coverage met, BUILD SUCCESS.

## Requirements Advanced

- R018 — ADMIN CRUD for users, no public registration, roles ADMIN/LISTENER enforced on all endpoints

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Used java.security.Principal instead of @AuthenticationPrincipal for username extraction \u2014 more robust with both @WithMockUser and JWT filter.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/controller/UserController.java` — CRUD endpoints for user management with validation and self-deletion prevention
- `musicode-server/src/main/java/com/musicode/model/dto/CreateUserRequest.java` — Create user request DTO with validation
- `musicode-server/src/main/java/com/musicode/model/dto/UpdateUserRequest.java` — Update user request DTO (partial updates)
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java` — Role-based endpoint security rules + AccessDeniedHandler
- `musicode-server/src/test/java/com/musicode/controller/UserControllerTest.java` — 16 CRUD + role enforcement tests
- `musicode-server/src/test/java/com/musicode/controller/LibraryControllerTest.java` — 6 listener role enforcement tests added
