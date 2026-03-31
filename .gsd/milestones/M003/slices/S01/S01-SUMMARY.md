---
id: S01
parent: M003
milestone: M003
provides:
  - User entity + UserRepository for S02 auth and S03 user CRUD
  - RefreshToken entity + RefreshTokenRepository for S02 token management
  - MusicodeUserDetailsService for S02 SecurityFilterChain
  - BCrypt PasswordEncoder bean for S02 login flow
  - Permit-all SecurityFilterChain as starting point for S02 to replace
requires:
  []
affects:
  - S02 — SecurityFilterChain will use UserDetailsService and PasswordEncoder from this slice
  - S03 — UserController will CRUD the User entity from this slice
key_files:
  - musicode-server/src/main/java/com/musicode/model/entity/User.java
  - musicode-server/src/main/java/com/musicode/model/entity/RefreshToken.java
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
  - musicode-server/src/main/java/com/musicode/config/AdminSeeder.java
  - musicode-server/src/main/java/com/musicode/service/MusicodeUserDetailsService.java
key_decisions:
  - spring-boot-starter-security added with permit-all chain to avoid breaking existing tests
  - @DataJpaTest for repository tests, @SpringBootTest for service/config tests
  - Admin default password configurable via application.yml, logged warning if using default
patterns_established:
  - User entity with BCrypt-hashed password and Role enum
  - AdminSeeder pattern: check-then-create with ApplicationRunner, configurable default password
  - MusicodeUserDetailsService maps domain User to Spring Security UserDetails
observability_surfaces:
  - Admin seed logged at startup with warning for default password
  - User count queryable via H2 console in dev
drill_down_paths:
  - .gsd/milestones/M003/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M003/slices/S01/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T07:43:52.775Z
blocker_discovered: false
---

# S01: User Model & Foundation

**User & RefreshToken entities, UserDetailsService, admin seed, 12 new tests — auth data layer ready for S02 JWT implementation.**

## What Happened

Built the user auth foundation for Musicode. Created User entity (username, passwordHash, role ADMIN/LISTENER, enabled, createdAt) and RefreshToken entity (user FK, tokenHash, expiresAt, revoked) with H2 persistence. UserRepository provides lookup by username and role existence checks. RefreshTokenRepository supports token lookup by hash, expiration cleanup, and bulk revocation per user. MusicodeUserDetailsService bridges User to Spring Security's UserDetails with ROLE_ADMIN/ROLE_LISTENER authorities. AdminSeeder auto-creates an admin user on first startup with configurable default password and warns if unchanged. SecurityConfig includes BCrypt encoder and a temporary permit-all filter chain so all existing tests and endpoints continue working. 12 new tests (UserRepositoryTest, MusicodeUserDetailsServiceTest, AdminSeederTest) bring the suite to 56 total, all green, JaCoCo ≥80% enforced.

## Verification

mvn clean verify — 56 tests, 0 failures, JaCoCo ≥80% coverage met, BUILD SUCCESS.

## Requirements Advanced

- R017 — User entity with roles, UserDetailsService, and PasswordEncoder provide auth foundation
- R018 — User entity with ADMIN/LISTENER roles, admin seed, and existsByRole check

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

All three tasks executed in a single efficient pass rather than sequentially — no functional deviation.

## Known Limitations

SecurityFilterChain is permit-all — intentionally temporary, S02 replaces with JWT auth.

## Follow-ups

None.

## Files Created/Modified

- `musicode-server/pom.xml` — Added spring-boot-starter-security and spring-security-test dependencies
- `musicode-server/src/main/resources/application.yml` — Added musicode.admin.default-password property
- `musicode-server/src/main/java/com/musicode/model/entity/User.java` — User entity with id/username/passwordHash/role/enabled/createdAt
- `musicode-server/src/main/java/com/musicode/model/entity/RefreshToken.java` — RefreshToken entity with user FK, tokenHash, expiresAt, revoked
- `musicode-server/src/main/java/com/musicode/model/entity/Role.java` — ADMIN/LISTENER enum
- `musicode-server/src/main/java/com/musicode/repository/UserRepository.java` — findByUsername, existsByUsername, existsByRole
- `musicode-server/src/main/java/com/musicode/repository/RefreshTokenRepository.java` — findByTokenHash, deleteAllExpiredBefore, revokeAllByUser
- `musicode-server/src/main/java/com/musicode/service/MusicodeUserDetailsService.java` — Loads User by username, maps to Spring Security UserDetails with ROLE_ authority
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java` — BCrypt PasswordEncoder bean + temporary permit-all SecurityFilterChain
- `musicode-server/src/main/java/com/musicode/config/AdminSeeder.java` — Seeds admin user on first startup if no ADMIN exists
- `musicode-server/src/test/java/com/musicode/repository/UserRepositoryTest.java` — 5 tests: save/find, unique constraint, existsByRole, existsByUsername
- `musicode-server/src/test/java/com/musicode/service/MusicodeUserDetailsServiceTest.java` — 4 tests: admin/listener authorities, not found, disabled user
- `musicode-server/src/test/java/com/musicode/config/AdminSeederTest.java` — 3 tests: seed, idempotency, bcrypt verification
