---
estimated_steps: 1
estimated_files: 5
skills_used: []
---

# T02: UserDetailsService + PasswordEncoder + admin seed

Create MusicodeUserDetailsService implementing Spring Security UserDetailsService — loads User by username from UserRepository, maps to Spring Security UserDetails with role as GrantedAuthority (ROLE_ADMIN, ROLE_LISTENER). Create SecurityBeansConfig with BCryptPasswordEncoder bean. Create AdminSeeder (CommandLineRunner or ApplicationRunner) that checks if any ADMIN user exists — if not, creates one with username 'admin' and a configurable default password from application.yml (musicode.admin.default-password, default 'changeme'). Log a warning at startup if using default password. Add spring-boot-starter-security dependency to pom.xml. Add a minimal SecurityFilterChain that permits all requests (temporary — S02 will lock it down) so existing functionality is not broken.

## Inputs

- `UserRepository.java from T01`
- `application.yml`

## Expected Output

- `MusicodeUserDetailsService.java`
- `SecurityBeansConfig.java`
- `AdminSeeder.java`
- `Updated pom.xml`
- `Updated application.yml`

## Verification

Start Spring Boot, verify admin user seeded in H2 console, verify existing endpoints still work without auth
