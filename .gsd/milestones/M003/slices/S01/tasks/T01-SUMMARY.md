---
id: T01
parent: S01
milestone: M003
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/model/entity/User.java", "musicode-server/src/main/java/com/musicode/model/entity/RefreshToken.java", "musicode-server/src/main/java/com/musicode/model/entity/Role.java", "musicode-server/src/main/java/com/musicode/repository/UserRepository.java", "musicode-server/src/main/java/com/musicode/repository/RefreshTokenRepository.java", "musicode-server/src/main/java/com/musicode/service/MusicodeUserDetailsService.java", "musicode-server/src/main/java/com/musicode/config/SecurityConfig.java", "musicode-server/src/main/java/com/musicode/config/AdminSeeder.java", "musicode-server/src/test/java/com/musicode/repository/UserRepositoryTest.java", "musicode-server/src/test/java/com/musicode/service/MusicodeUserDetailsServiceTest.java", "musicode-server/src/test/java/com/musicode/config/AdminSeederTest.java"]
key_decisions: ["Used @DataJpaTest for repository tests (lighter context than @SpringBootTest)", "AdminSeeder test calls run(null) directly after clearing DB to test idempotency"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn clean verify — 56 tests pass, 0 failures, JaCoCo coverage checks met, BUILD SUCCESS."
completed_at: 2026-03-31T07:42:55.237Z
blocker_discovered: false
---

# T01: User/RefreshToken entities, repositories, UserDetailsService, admin seed, SecurityConfig permit-all, and 12 integration tests — all green, coverage met.

> User/RefreshToken entities, repositories, UserDetailsService, admin seed, SecurityConfig permit-all, and 12 integration tests — all green, coverage met.

## What Happened
---
id: T01
parent: S01
milestone: M003
key_files:
  - musicode-server/src/main/java/com/musicode/model/entity/User.java
  - musicode-server/src/main/java/com/musicode/model/entity/RefreshToken.java
  - musicode-server/src/main/java/com/musicode/model/entity/Role.java
  - musicode-server/src/main/java/com/musicode/repository/UserRepository.java
  - musicode-server/src/main/java/com/musicode/repository/RefreshTokenRepository.java
  - musicode-server/src/main/java/com/musicode/service/MusicodeUserDetailsService.java
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
  - musicode-server/src/main/java/com/musicode/config/AdminSeeder.java
  - musicode-server/src/test/java/com/musicode/repository/UserRepositoryTest.java
  - musicode-server/src/test/java/com/musicode/service/MusicodeUserDetailsServiceTest.java
  - musicode-server/src/test/java/com/musicode/config/AdminSeederTest.java
key_decisions:
  - Used @DataJpaTest for repository tests (lighter context than @SpringBootTest)
  - AdminSeeder test calls run(null) directly after clearing DB to test idempotency
duration: ""
verification_result: passed
completed_at: 2026-03-31T07:42:55.238Z
blocker_discovered: false
---

# T01: User/RefreshToken entities, repositories, UserDetailsService, admin seed, SecurityConfig permit-all, and 12 integration tests — all green, coverage met.

**User/RefreshToken entities, repositories, UserDetailsService, admin seed, SecurityConfig permit-all, and 12 integration tests — all green, coverage met.**

## What Happened

Created all three entities (User, RefreshToken, Role enum) and both repositories. Added spring-boot-starter-security and spring-security-test dependencies. Built MusicodeUserDetailsService that maps User to Spring Security UserDetails with ROLE_ADMIN/ROLE_LISTENER authorities. Created SecurityConfig with permit-all filter chain (temporary — S02 locks it down) so existing endpoints and tests keep working. AdminSeeder creates default admin on first startup with configurable password, warns if using default. Wrote 12 new tests across 3 test classes: UserRepositoryTest (5 tests — save/find, uniqueness, role check), MusicodeUserDetailsServiceTest (4 tests — admin/listener authorities, not-found, disabled), AdminSeederTest (3 tests — seed, idempotency, bcrypt encoding). All 56 tests pass, JaCoCo coverage gate met.

## Verification

mvn clean verify — 56 tests pass, 0 failures, JaCoCo coverage checks met, BUILD SUCCESS.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn clean verify` | 0 | ✅ pass | 16866ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/model/entity/User.java`
- `musicode-server/src/main/java/com/musicode/model/entity/RefreshToken.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Role.java`
- `musicode-server/src/main/java/com/musicode/repository/UserRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/RefreshTokenRepository.java`
- `musicode-server/src/main/java/com/musicode/service/MusicodeUserDetailsService.java`
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`
- `musicode-server/src/main/java/com/musicode/config/AdminSeeder.java`
- `musicode-server/src/test/java/com/musicode/repository/UserRepositoryTest.java`
- `musicode-server/src/test/java/com/musicode/service/MusicodeUserDetailsServiceTest.java`
- `musicode-server/src/test/java/com/musicode/config/AdminSeederTest.java`


## Deviations
None.

## Known Issues
None.
