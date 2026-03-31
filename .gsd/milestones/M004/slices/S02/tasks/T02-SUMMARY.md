---
id: T02
parent: S02
milestone: M004
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/resources/logback-spring.xml", "musicode-server/src/main/java/com/musicode/filter/RequestIdFilter.java", "musicode-server/src/main/java/com/musicode/config/SecurityConfig.java", "musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java", "musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java", "musicode-server/src/main/java/com/musicode/util/CookieUtil.java"]
key_decisions: ["logback-spring.xml with dev (colored readable) and docker (JSON structured) profiles", "RequestIdFilter at HIGHEST_PRECEDENCE — runs before security filters", "8-char UUID prefix for request IDs (readable in logs without clutter)", "Moved logging config from application*.yml to logback-spring.xml"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn clean verify — 97 tests pass, coverage ≥80%."
completed_at: 2026-03-31T10:16:19.753Z
blocker_discovered: false
---

# T02: logback-spring.xml + MDC RequestIdFilter + didactic comments across security layer — 97 tests green.

> logback-spring.xml + MDC RequestIdFilter + didactic comments across security layer — 97 tests green.

## What Happened
---
id: T02
parent: S02
milestone: M004
key_files:
  - musicode-server/src/main/resources/logback-spring.xml
  - musicode-server/src/main/java/com/musicode/filter/RequestIdFilter.java
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
  - musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java
  - musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java
  - musicode-server/src/main/java/com/musicode/util/CookieUtil.java
key_decisions:
  - logback-spring.xml with dev (colored readable) and docker (JSON structured) profiles
  - RequestIdFilter at HIGHEST_PRECEDENCE — runs before security filters
  - 8-char UUID prefix for request IDs (readable in logs without clutter)
  - Moved logging config from application*.yml to logback-spring.xml
duration: ""
verification_result: passed
completed_at: 2026-03-31T10:16:19.754Z
blocker_discovered: false
---

# T02: logback-spring.xml + MDC RequestIdFilter + didactic comments across security layer — 97 tests green.

**logback-spring.xml + MDC RequestIdFilter + didactic comments across security layer — 97 tests green.**

## What Happened

Created logback-spring.xml with profile-aware formatting: dev uses colored console with requestId, docker uses JSON structured logging. RequestIdFilter (OncePerRequestFilter, HIGHEST_PRECEDENCE) adds UUID-based requestId to MDC and X-Request-Id response header. Added comprehensive didactic comments to SecurityConfig (5 architecture decisions), JwtAuthFilter (why cookies, why extract role from token), RefreshTokenService (4 design decisions: opaque tokens, hashed storage, rotation, theft detection), CookieUtil (4 security flags explained), and GlobalExceptionHandler (why both advice and SecurityConfig handlers). Logging config moved from application*.yml to logback-spring.xml.

## Verification

mvn clean verify — 97 tests pass, coverage ≥80%.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn clean verify` | 0 | ✅ pass | 21700ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/resources/logback-spring.xml`
- `musicode-server/src/main/java/com/musicode/filter/RequestIdFilter.java`
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`
- `musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java`
- `musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java`
- `musicode-server/src/main/java/com/musicode/util/CookieUtil.java`


## Deviations
None.

## Known Issues
None.
