# S01: Service Unit Tests + Coverage Restoration

**Goal:** Write unit tests for every service currently excluded from JaCoCo or simply untested (Stats, Lastfm, ListenBrainz, Scrobble, Activity). Remove the JaCoCo exclusions that hide scrobble services and restore the 80% bundle-line coverage threshold so `mvn clean verify` measures the real surface.
**Demo:** 

## Must-Haves

- `mvn clean verify` passes with no JaCoCo exclusions for LastfmService, ListenBrainzService, ScrobbleService.
- StatsService, LastfmService, ListenBrainzService, ScrobbleService, ActivityService each have a dedicated unit test class with ≥80% line coverage.
- Bundle line coverage stays ≥80% after the excludes are removed (no silent drop).
- Retry logic in ScrobbleService is exercised: success on first try, success after retry, exhaustion after 3 attempts.
- ActivityService tests cover: register emitter, broadcast to N emitters, dead-emitter cleanup, recent-events replay on subscribe.

## Proof Level

- This slice proves: unit

## Integration Closure

No integration work in this slice. All tests run under `surefire` with Mockito — no Spring context, no HTTP, no DB. S02 handles live API verification against Last.fm/ListenBrainz.

## Verification

- Coverage reports become trustworthy again. The `target/site/jacoco/index.html` report will reflect actual scrobble-path coverage instead of hiding it.

## Tasks

- [x] **T01: StatsService unit tests** `est:30m`
  Unit test StatsService: getSummary, topTracks, topAlbums, topArtists, playsOverTime. Mock PlaybackEventRepository. Cover empty-result branches and date-range aggregation.
  - Files: `musicode-server/src/test/java/com/musicode/service/StatsServiceTest.java`
  - Verify: cd musicode-server && mvn -q -Dtest=StatsServiceTest test

- [x] **T02: LastfmService unit tests (signature + HTTP)** `est:1h`
  Unit test LastfmService. Focus: API signature generation (MD5 of sorted params + secret), scrobble payload building, error mapping. Mock RestTemplate / HttpClient. Verify signature determinism against a known-good fixture.
  - Files: `musicode-server/src/test/java/com/musicode/service/LastfmServiceTest.java`
  - Verify: cd musicode-server && mvn -q -Dtest=LastfmServiceTest test

- [x] **T03: ListenBrainzService unit tests** `est:45m`
  Unit test ListenBrainzService. Focus: token-auth header shape, submit-listen payload structure, HTTP error branches. Mock HTTP client.
  - Files: `musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceTest.java`
  - Verify: cd musicode-server && mvn -q -Dtest=ListenBrainzServiceTest test

- [x] **T04: ScrobbleService retry orchestration tests** `est:1h15m`
  Unit test ScrobbleService. Focus: @Async retry with exponential backoff (1s→2s→4s, max 3 attempts), fire-and-forget behavior (never throws), per-user provider selection (Lastfm vs ListenBrainz vs both vs neither). Mock LastfmService and ListenBrainzService. Use short backoff override or inject a Sleeper abstraction if needed to avoid slow tests.
  - Files: `musicode-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java`, `musicode-server/src/main/java/com/musicode/service/ScrobbleService.java`
  - Verify: cd musicode-server && mvn -q -Dtest=ScrobbleServiceTest test

- [x] **T05: ActivityService SSE broadcast tests** `est:45m`
  Unit test ActivityService. Focus: subscribe() returns a live SseEmitter and replays recent events from the ConcurrentLinkedDeque; broadcast() fans out to all active emitters; dead/IOException emitters are removed during broadcast; recent-events buffer caps at 20 (oldest evicted).
  - Files: `musicode-server/src/test/java/com/musicode/service/ActivityServiceTest.java`
  - Verify: cd musicode-server && mvn -q -Dtest=ActivityServiceTest test

- [x] **T06: Remove JaCoCo exclusions and restore coverage gate** `est:30m`
  Drop LastfmService, ListenBrainzService, ScrobbleService from the JaCoCo <excludes> block in pom.xml. Keep LibraryScanService, MetadataService, CoverArtService, AudioStreamService excluded (I/O + file-system heavy, tested separately via integration). Run `mvn clean verify` and confirm the bundle line coverage ≥80% rule still passes. If any uncovered hotspot drops the bundle below threshold, add targeted tests to the prior service's test class — not by re-excluding.
  - Files: `musicode-server/pom.xml`
  - Verify: cd musicode-server && mvn clean verify

- [x] **T07: WireMock HTTP contract tests for scrobble services** `est:1h30m` _(post-close hardening, 2026-04-16)_
  Added HTTP-level tests for LastfmService and ListenBrainzService using WireMock. Mockito can't catch a wrong request body or malformed signature on the wire; WireMock stubs validate actual bytes. Refactored `API_URL` constants in both services to `@Value`-injected fields with public defaults so tests can redirect to a local WireMock server without touching production behavior. Covered: 401 / 403 / 429 / 500 / 503, connection reset, signature + form-encoding, JSON wire format, Unicode roundtrip. 168 → 187 tests passing.
  - Files: `musicode-server/pom.xml`, `musicode-server/src/main/java/com/musicode/service/LastfmService.java`, `musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java`, `musicode-server/src/test/java/com/musicode/service/LastfmServiceWireMockTest.java`, `musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceWireMockTest.java`
  - Verify: cd musicode-server && mvn -q -Dtest='LastfmServiceWireMockTest,ListenBrainzServiceWireMockTest' test

## Files Likely Touched

- musicode-server/src/test/java/com/musicode/service/StatsServiceTest.java
- musicode-server/src/test/java/com/musicode/service/LastfmServiceTest.java
- musicode-server/src/test/java/com/musicode/service/LastfmServiceWireMockTest.java
- musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceTest.java
- musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceWireMockTest.java
- musicode-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java
- musicode-server/src/main/java/com/musicode/service/ScrobbleService.java
- musicode-server/src/main/java/com/musicode/service/LastfmService.java
- musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java
- musicode-server/src/test/java/com/musicode/service/ActivityServiceTest.java
- musicode-server/pom.xml
