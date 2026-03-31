# S03: User Management & Role Enforcement

**Goal:** CRUD endpoints for user management (ADMIN only) and role-based access control on existing endpoints
**Demo:** After this: After this: ADMIN can create/list/update/delete users via API. LISTENER can browse and play but cannot manage library folders or users. Role enforcement tested.

## Tasks
- [x] **T01: UserController with CRUD endpoints, DTOs with validation, self-deletion prevention.** — Create UserController with endpoints: GET /api/users (list all), GET /api/users/{id} (detail), POST /api/users (create with username/password/role), PUT /api/users/{id} (update username/role/enabled, optional password change), DELETE /api/users/{id} (delete). Create CreateUserRequest DTO (username, password, role) and UpdateUserRequest DTO (username, role, enabled, password optional). Validation: username required, unique check, password required on create, role must be valid. Never return passwordHash in responses — use UserResponse from S02. Admin cannot delete themselves.
  - Estimate: 20min
  - Files: musicode-server/src/main/java/com/musicode/controller/UserController.java, musicode-server/src/main/java/com/musicode/model/dto/CreateUserRequest.java, musicode-server/src/main/java/com/musicode/model/dto/UpdateUserRequest.java
  - Verify: mvn compile — compiles cleanly
- [x] **T02: SecurityFilterChain updated with ADMIN-only rules for user management and library mutations, 403 JSON handler.** — Update SecurityFilterChain in SecurityConfig with role-based rules: /api/users/** requires ROLE_ADMIN. /api/library/folders/** (POST, DELETE) requires ROLE_ADMIN. /api/library/scan requires ROLE_ADMIN. /api/library/cleanup requires ROLE_ADMIN. /api/library/folders GET and /api/library/scan/status GET open to any authenticated user (listeners need to see folder list and scan status). /api/tracks/**, /api/albums/**, /api/artists/**, /api/stream/**, /api/covers/**, /api/search/** open to any authenticated user. Add AccessDeniedHandler returning 403 JSON instead of Spring's default HTML.
  - Estimate: 15min
  - Files: musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
  - Verify: mvn compile — compiles cleanly
- [x] **T03: 16 UserController tests + 6 library role tests = 22 new tests, 97 total, green, coverage met.** — Write UserControllerTest: ADMIN can list users, ADMIN can create user, ADMIN can update user, ADMIN can delete user, ADMIN cannot delete self, create with duplicate username returns 409, create with blank fields returns 400, password never in response. LISTENER gets 403 on all user CRUD. Write role enforcement tests: LISTENER gets 403 on POST/DELETE library folders, LISTENER gets 403 on POST scan, LISTENER can GET folders and scan status, LISTENER can browse tracks/albums/artists/search. Verify all existing tests still pass. Coverage ≥80%.
  - Estimate: 25min
  - Files: musicode-server/src/test/java/com/musicode/controller/UserControllerTest.java, musicode-server/src/test/java/com/musicode/controller/LibraryControllerTest.java
  - Verify: mvn clean verify — all tests pass, coverage ≥80%
