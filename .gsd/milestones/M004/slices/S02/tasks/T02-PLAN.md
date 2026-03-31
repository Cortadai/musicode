---
estimated_steps: 1
estimated_files: 8
skills_used: []
---

# T02: Logback + MDC + didactic comments

Create logback-spring.xml with two profiles: dev (console, pattern with timestamp/level/logger/requestId/message, colored) and docker (JSON format with logstash-logback-encoder or structured pattern). Create RequestIdFilter (OncePerRequestFilter) that generates UUID, puts it in MDC as 'requestId', clears on completion. Register in SecurityConfig filter chain or as a @Component with @Order. Add relevant logging to: GlobalExceptionHandler (log errors with requestId, stack trace for 500s), AuthController (login success/fail already there, add refresh/logout), UserController (CRUD operations with acting user). Add didactic comments to: SecurityConfig (why each rule, why CSRF disabled, why stateless, filter chain order), JwtAuthFilter (why cookie not header, why skip login, how SecurityContext works), RefreshTokenService (why hash, why rotate, why revoke-all on reuse), CookieUtil (why HttpOnly, why SameSite=Strict, why path restriction), TokenHashUtil (why SHA-256, what it protects against).

## Inputs

- `All service/config/filter files`

## Expected Output

- `logback-spring.xml`
- `RequestIdFilter.java`
- `Updated files with logging and comments`

## Verification

mvn clean verify — all tests pass, coverage ≥80%
