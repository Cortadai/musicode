---
id: T01
parent: S05
milestone: M008
key_files:
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
  - musicode-server/src/main/java/com/musicode/filter/LoginRateLimitFilter.java
  - musicode-server/src/main/java/com/musicode/filter/RequestIdFilter.java
  - musicode-server/src/main/resources/application.yml
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-17T19:36:24.064Z
blocker_discovered: false
---

# T01: Actuator health endpoint, CSP/HSTS/X-Frame security headers, and login rate limiter with 429 lockout

**Actuator health endpoint, CSP/HSTS/X-Frame security headers, and login rate limiter with 429 lockout**

## What Happened

Enabled Spring Boot Actuator with health and info endpoints exposed. Added security headers in SecurityConfig: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options. Created LoginRateLimitFilter with ConcurrentHashMap tracking failed attempts per IP, 5-attempt threshold triggers 429 Too Many Requests with configurable lockout duration. RequestIdFilter adds X-Request-Id for traceability. Commit: 619a9e0.

## Verification

curl /actuator/health returns {status: UP}. Response headers include CSP and HSTS. 6 failed logins from same IP trigger 429.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `curl /actuator/health` | 0 | pass | 2000ms |
| 2 | `curl -I /api/auth/login (check headers)` | 0 | pass | 1000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`
- `musicode-server/src/main/java/com/musicode/filter/LoginRateLimitFilter.java`
- `musicode-server/src/main/java/com/musicode/filter/RequestIdFilter.java`
- `musicode-server/src/main/resources/application.yml`
