---
id: T01
parent: S02
milestone: M003
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/service/JwtService.java", "musicode-server/pom.xml", "musicode-server/src/main/resources/application.yml"]
key_decisions: ["JJWT 0.12.6 for JWT generation/validation", "HS256 signing with configurable secret key ≥32 bytes"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "mvn compile — compiles cleanly."
completed_at: 2026-03-31T07:53:35.259Z
blocker_discovered: false
---

# T01: JJWT 0.12.6 dependency + JwtService with generate/validate/extract for access and refresh tokens.

> JJWT 0.12.6 dependency + JwtService with generate/validate/extract for access and refresh tokens.

## What Happened
---
id: T01
parent: S02
milestone: M003
key_files:
  - musicode-server/src/main/java/com/musicode/service/JwtService.java
  - musicode-server/pom.xml
  - musicode-server/src/main/resources/application.yml
key_decisions:
  - JJWT 0.12.6 for JWT generation/validation
  - HS256 signing with configurable secret key ≥32 bytes
duration: ""
verification_result: passed
completed_at: 2026-03-31T07:53:35.260Z
blocker_discovered: false
---

# T01: JJWT 0.12.6 dependency + JwtService with generate/validate/extract for access and refresh tokens.

**JJWT 0.12.6 dependency + JwtService with generate/validate/extract for access and refresh tokens.**

## What Happened

Added JJWT 0.12.6 dependencies (api, impl, jackson). Created JwtService with HS256 signing, configurable secret/expiration via application.yml. Generates access tokens (15 min) and refresh JWTs (7 days) with username, role, userId claims.

## Verification

mvn compile — compiles cleanly.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn compile` | 0 | ✅ pass | 4900ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/JwtService.java`
- `musicode-server/pom.xml`
- `musicode-server/src/main/resources/application.yml`


## Deviations
None.

## Known Issues
None.
