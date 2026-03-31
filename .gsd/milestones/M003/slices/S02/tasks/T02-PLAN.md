---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: AuthService + RefreshTokenService

Create RefreshTokenService: createToken(User) generates random UUID, hashes with SHA-256, persists to RefreshToken table, returns raw token. validateAndRotate(String rawToken) finds by hash, checks expiry/revoked, creates new token, revokes old. revokeAllForUser(User). cleanupExpired() with @Scheduled. Create AuthService: login(username, password) authenticates via AuthenticationManager, returns TokenPair(accessToken, refreshToken). refresh(rawRefreshToken) validates and rotates via RefreshTokenService, generates new access token. logout(rawRefreshToken) revokes in DB.

## Inputs

- `JwtService from T01`
- `UserRepository`
- `RefreshTokenRepository`

## Expected Output

- `RefreshTokenService.java`
- `AuthService.java`
- `TokenPair.java`

## Verification

mvn compile — compiles cleanly
