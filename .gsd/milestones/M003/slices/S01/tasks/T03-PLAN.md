---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T03: Integration tests for user model and seed

Create UserRepositoryTest: verify save/find by username, unique constraint on username, role persistence. Create AdminSeederTest: verify admin user created on empty DB, verify admin NOT re-created if one already exists, verify password is BCrypt-encoded. Create MusicodeUserDetailsServiceTest: verify loadUserByUsername returns correct authorities, verify UsernameNotFoundException for unknown user. Verify all existing tests still pass. Verify coverage gate maintained.

## Inputs

- `User.java`
- `UserRepository.java`
- `AdminSeeder.java`
- `MusicodeUserDetailsService.java`
- `application-test.yml`

## Expected Output

- `UserRepositoryTest.java`
- `MusicodeUserDetailsServiceTest.java`
- `AdminSeederTest.java`

## Verification

mvn clean verify -f musicode-server/pom.xml — all tests pass, coverage ≥80%
