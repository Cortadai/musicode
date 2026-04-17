---
id: T01
parent: S01
milestone: M006
key_files:
  - musicode-server/pom.xml
  - musicode-server/src/main/java/com/musicode/config/OpenApiConfig.java
  - musicode-server/src/main/java/com/musicode/config/SecurityConfig.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-17T19:54:30.230Z
blocker_discovered: false
---

# T01: Added SpringDoc OpenAPI dependency, Security config, and OpenApiConfig bean with cookie auth

**Added SpringDoc OpenAPI dependency, Security config, and OpenApiConfig bean with cookie auth**

## What Happened

Added springdoc-openapi-starter-webmvc-ui 2.8.14 to pom.xml (pinned due to 2.8.15+ incompatibility with Spring Boot 3.4.4). Created OpenApiConfig with app title, version, cookie-based auth scheme. Updated SecurityConfig to permit /swagger-ui/**, /v3/api-docs/**, /swagger-ui.html. Server starts cleanly with SpringDoc on classpath.

## Verification

curl http://localhost:8080/swagger-ui/index.html returns 200. curl http://localhost:8080/v3/api-docs returns OpenAPI 3.1.0 JSON with 31 paths.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/swagger-ui/index.html` | 0 | pass | 200ms |
| 2 | `curl -s http://localhost:8080/v3/api-docs | jq .openapi` | 0 | pass | 150ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/pom.xml`
- `musicode-server/src/main/java/com/musicode/config/OpenApiConfig.java`
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`
