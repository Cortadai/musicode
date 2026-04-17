---
id: S01
parent: M006
milestone: M006
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-server/pom.xml", "musicode-server/src/main/java/com/musicode/config/OpenApiConfig.java", "musicode-server/src/main/java/com/musicode/config/SecurityConfig.java"]
key_decisions:
  - ["Pinned springdoc to 2.8.14 — 2.8.15+ breaks with Spring Boot 3.4.4 path matching"]
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-17T19:55:02.979Z
blocker_discovered: false
---

# S01: SpringDoc OpenAPI + Swagger UI

**SpringDoc OpenAPI integrated with Swagger UI, cookie auth, and full controller annotations**

## What Happened

Added springdoc-openapi-starter-webmvc-ui 2.8.14, configured OpenApiConfig with cookie-based auth, permitted Swagger paths in SecurityConfig, and annotated all 13 controllers with @Tag/@Operation/@ApiResponse. Swagger UI serves a living, auto-generated API reference at /swagger-ui/index.html. OpenAPI 3.1.0 spec available at /v3/api-docs with 31 documented paths. Pinned to 2.8.14 due to known incompatibility between 2.8.15+ and Spring Boot 3.4.4 (GitHub issue #3210).

## Verification

Swagger UI returns HTTP 200. /v3/api-docs returns valid OpenAPI 3.1.0 JSON with 31 paths. All controllers visible with descriptions and schemas. Commit ff663cf.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

None.
