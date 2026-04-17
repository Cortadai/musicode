# S05: Production Hardening — Actuator, Security Headers, Rate Limiting

**Goal:** Actuator health endpoints, security headers (CSP, HSTS, X-Frame), and login rate limiting
**Demo:** 

## Must-Haves

- Not provided.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Actuator health, security headers, login rate limiter** `est:40min`
  Enable Spring Boot Actuator with health/info endpoints. Add security headers via SecurityConfig (CSP, HSTS, X-Content-Type-Options, X-Frame-Options). Implement LoginRateLimitFilter with in-memory attempt tracking and lockout.
  - Files: `musicode-server/pom.xml`, `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`, `musicode-server/src/main/java/com/musicode/filter/LoginRateLimitFilter.java`, `musicode-server/src/main/resources/application.yml`
  - Verify: curl /actuator/health returns UP. Response headers include CSP and HSTS. 5+ failed logins trigger 429.

## Files Likely Touched

- musicode-server/pom.xml
- musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
- musicode-server/src/main/java/com/musicode/filter/LoginRateLimitFilter.java
- musicode-server/src/main/resources/application.yml
