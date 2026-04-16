---
id: S01
parent: M008
milestone: M008
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["musicode-server/src/test/java/com/musicode/service/StatsServiceTest.java", "musicode-server/src/test/java/com/musicode/service/LastfmServiceTest.java", "musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceTest.java", "musicode-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java", "musicode-server/src/test/java/com/musicode/service/ActivityServiceTest.java", "musicode-server/src/main/java/com/musicode/service/ScrobbleService.java", "musicode-server/pom.xml"]
key_decisions:
  - ["Converted ScrobbleService.BASE_DELAY_MS from static final to an instance field so retry tests can override the backoff to 1ms. Production default unchanged.", "Dropped onCompletion/onTimeout/onError callback tests from ActivityService \u2014 Spring's SseEmitter does not fire those callbacks until an HTTP handler attaches. Dead-emitter removal is covered via the IOException path."]
patterns_established:
  - ["ReflectionTestUtils.setField swaps inline-constructed RestTemplate fields in services \u2014 avoids refactoring production code for an injection point used only in tests.", "Private utility methods with non-trivial deterministic logic (e.g. generateSignature) are tested via reflection to pin behavior."]
observability_surfaces:
  - ["target/site/jacoco/index.html now reflects real scrobble-path coverage instead of hiding it"]
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-16T18:04:05.880Z
blocker_discovered: false
---

# S01: Service Unit Tests + Coverage Restoration

**Full unit test coverage for scrobble + activity + stats services; JaCoCo excludes dropped; bundle line coverage 87.10%**

## What Happened

Closed the coverage blind spot that had been hiding the scrobble/activity paths. Six tasks, all green. T01 added 13 StatsService tests. T02 added 16 LastfmService tests covering signature determinism against a hand-computed MD5 fixture, the mobile-session auth flow (success / no session / exception / blank config), and scrobble payload building (full/optional fields/null fallbacks). T03 added 6 ListenBrainzService tests covering the bearer token header shape, single-listen payload structure, and error branches. T04 added 14 ScrobbleService tests covering provider selection (none/only-LB/only-Lastfm/both/blank-token), retry on failure, retry on exception (fire-and-forget never bubbles), exhaustion after 3 attempts, and independent retries per provider. `BASE_DELAY_MS` was converted from `static final` to an instance field so tests can shrink it to 1ms — production default unchanged. T05 added 11 ActivityService tests covering subscribe/broadcast, recent-buffer cap at 20 with newest-first ordering, dead-emitter removal on IOException, and unknown-artist/album fallbacks. T06 dropped LastfmService/ListenBrainzService/ScrobbleService from the JaCoCo `<excludes>` block; `mvn clean verify` completed with BUILD SUCCESS, 168 tests passing, and 87.10% bundle line coverage (621/713). I/O-heavy services (LibraryScanService, MetadataService, CoverArtService, AudioStreamService) remain excluded.

## Verification

mvn clean verify → BUILD SUCCESS. 168 tests pass (0 failures, 0 errors). JaCoCo check: "All coverage checks have been met." Bundle line coverage: 87.10% (above the 80% threshold).

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

S02 will exercise LastfmService/ListenBrainzService against real APIs with test accounts. LibraryScanService/MetadataService/CoverArtService/AudioStreamService still excluded from JaCoCo — will need integration tests later.

## Files Created/Modified

None.

---

## Addendum — WireMock HTTP Contract Hardening (2026-04-16, post-close)

After the formal close, added a second layer of tests that exercise the scrobble services at the HTTP wire level — Mockito-only tests cannot catch a wrong request body or a malformed signature on the wire. WireMock stubs validate the actual bytes sent.

**Changes:**
- `pom.xml` — added `org.wiremock:wiremock-standalone:3.9.2` (test scope).
- `LastfmService.java` / `ListenBrainzService.java` — replaced the hardcoded `API_URL` constant with a `@Value`-injected field with a public default (e.g. `${lastfm.api.url:https://ws.audioscrobbler.com/2.0/}`). Production behavior unchanged; tests can redirect the services to a local WireMock server.
- `ListenBrainzServiceWireMockTest` (7 tests) — 401 / 429 / 503 / connection reset / wire-format payload / Unicode roundtrip.
- `LastfmServiceWireMockTest` (12 tests) — auth + scrobble against 401 / 403 / 429 / 500 / 503, connection reset, signature and form-encoding verification, Unicode roundtrip.

**Numbers:** 168 → 187 tests passing (19 added). `mvn clean verify` BUILD SUCCESS. Bundle line coverage still ≥80% (JaCoCo gate passes).

**Why this matters:** the Map.of-empty-body bug that shipped in an earlier iteration of ListenBrainzService would have been caught by `submitListen_sendsCorrectlyFormedRequest` — that test reads the actual request body from the WireMock server and asserts its JSON shape. Mockito-only tests had no way to see the wire.

**Follow-ups unchanged:** S02 still covers real-API smoke with live accounts (credentials, rate-limit retry-after semantics, rotated tokens). S02's scope narrows slightly — wire contract and error-matrix are now covered; S02 focuses on live credentials + retry-after header behavior.
