---
id: T01
parent: S03
milestone: M007
key_files:
  - musicode-server/src/main/java/com/musicode/model/entity/User.java
  - musicode-server/src/main/java/com/musicode/controller/ScrobbleController.java
  - musicode-server/src/main/java/com/musicode/config/LastfmConfig.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-17T19:34:26.312Z
blocker_discovered: false
---

# T01: User scrobble settings fields, DTOs, and REST endpoints for config management

**User scrobble settings fields, DTOs, and REST endpoints for config management**

## What Happened

Added lastfmSessionKey and listenbrainzToken to User entity with AES-GCM encryption via EncryptedStringConverter. Created ScrobbleSettingsRequest/Response DTOs. ScrobbleController with GET/PUT /api/scrobble/settings endpoints. LastfmConfig properties class with @Value-injected API key/secret. Commit: 8927e40.

## Verification

mvn compile passes. GET /api/scrobble/settings returns scrobble status.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn compile` | 0 | pass | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/model/entity/User.java`
- `musicode-server/src/main/java/com/musicode/controller/ScrobbleController.java`
- `musicode-server/src/main/java/com/musicode/config/LastfmConfig.java`
