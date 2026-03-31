---
estimated_steps: 1
estimated_files: 5
skills_used: []
---

# T01: User & RefreshToken entities + repositories

Create User entity with fields: id (Long, auto), username (String, unique, not null), passwordHash (String, not null), role (enum ADMIN/LISTENER, not null), enabled (boolean, default true), createdAt (LocalDateTime). Create Role enum. Create RefreshToken entity with fields: id (Long, auto), user (ManyToOne User), tokenHash (String, unique, not null), expiresAt (Instant, not null), revoked (boolean, default false), createdAt (Instant). Create UserRepository with findByUsername(String). Create RefreshTokenRepository with findByTokenHash(String), deleteByUser(User), findAllByUserAndRevokedFalse(User), deleteAllByExpiresAtBefore(Instant).

## Inputs

- `Track.java entity as pattern reference`
- `application.yml for H2 config`

## Expected Output

- `User.java`
- `RefreshToken.java`
- `Role.java`
- `UserRepository.java`
- `RefreshTokenRepository.java`

## Verification

mvn compile -f musicode-server/pom.xml — compiles without error
