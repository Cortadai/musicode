---
id: S05
parent: M011
milestone: M011
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-server/src/main/java/com/musicode/model/dto/ScrobbleResult.java", "musicode-server/src/main/java/com/musicode/service/LastfmService.java", "musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java", "musicode-server/src/main/java/com/musicode/service/ScrobbleService.java", "musicode-ui/src/context/AuthContext.tsx", "musicode-ui/src/hooks/usePlayer.ts"]
key_decisions:
  - ["ScrobbleResult as Java record with ErrorType enum and isRetryable() — clean separation of retry policy from service logic", "AbortController only on unmount-sensitive calls (getMe, recordPlay), not user-initiated actions (login, logout)", "RestClientException (parent) falls to UNKNOWN — typed subclasses caught first"]
patterns_established:
  - ["ScrobbleResult DTO pattern for typed error returns from external service integrations", "AbortController ref pattern for fire-and-forget API calls in React hooks"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-18T17:49:06.656Z
blocker_discovered: false
---

# S05: Error handling servicios externos + cleanup

**Typed error classification for scrobble services, smart retry (no-retry on auth), and AbortController cleanup on frontend unmount**

## What Happened

Backend: Replaced boolean returns in LastfmService.scrobble() and ListenBrainzService.submitListen() with ScrobbleResult record carrying success/errorType/message. Typed catch blocks distinguish HttpClientErrorException (401/403→AUTH_ERROR), HttpServerErrorException (5xx→SERVER_ERROR), ResourceAccessException (timeout→TIMEOUT), config checks (→CONFIG_ERROR), and fallback (→UNKNOWN). Log markers now differentiate: LASTFM_AUTH_ERROR, LASTFM_TIMEOUT, LB_SERVER_ERROR, etc. ScrobbleService uses ScrobbleResult.isRetryable() — AUTH_ERROR and CONFIG_ERROR bail immediately (1 call), TIMEOUT and SERVER_ERROR retry with exponential backoff (1s, 2s, 4s). Frontend: Added AbortController to AuthContext.getMe() on mount and usePlayer.recordPlay() — both abort in-flight requests on unmount. Fixed tsconfig.app.json to exclude test files from the production build.

## Verification

Backend: mvn test — 236 tests pass (0 failures). WireMock tests assert correct ErrorType for 401, 503, connection reset, 429. ScrobbleServiceTest verifies no-retry for AUTH_ERROR/CONFIG_ERROR, retry for TIMEOUT/SERVER_ERROR. Frontend: tsc --noEmit clean, npm run build succeeds, vitest 109/109 pass.

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
