---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: JJWT dependency + JwtService

Add io.jsonwebtoken:jjwt-api, jjwt-impl, jjwt-jackson dependencies to pom.xml. Create JwtService with: generateAccessToken(User), generateRefreshToken(User), extractUsername(String token), isTokenValid(String token), isTokenExpired(String token). Access token 15min expiry. Refresh token 7 days. Secret key from application.yml (musicode.jwt.secret). Key must be ≥256 bits for HS256.

## Inputs

- `pom.xml`
- `application.yml`

## Expected Output

- `JwtService.java with generate/validate/extract methods`

## Verification

mvn compile — compiles cleanly
