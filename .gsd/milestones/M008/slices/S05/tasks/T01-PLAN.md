---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T01: Actuator health, security headers, login rate limiter

Enable Spring Boot Actuator with health/info endpoints. Add security headers via SecurityConfig (CSP, HSTS, X-Content-Type-Options, X-Frame-Options). Implement LoginRateLimitFilter with in-memory attempt tracking and lockout.

## Inputs

- `existing SecurityConfig`

## Expected Output

- `LoginRateLimitFilter.java`
- `updated SecurityConfig.java`
- `updated application.yml`

## Verification

curl /actuator/health returns UP. Response headers include CSP and HSTS. 5+ failed logins trigger 429.
