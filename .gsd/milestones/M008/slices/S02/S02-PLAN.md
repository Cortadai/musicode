# S02: Scrobble Integration Verification

**Goal:** Full test coverage for the scrobble integration layer: ScrobbleController (4 endpoints), ScrobbleSettingsResponse DTO logic, and Play→Scrobble invocation path. Mock boundary approach — wire-level testing already covered by S01.
**Demo:** 

## Must-Haves

- All 4 ScrobbleController endpoints tested via MockMvc (happy + error paths). ScrobbleSettingsResponse.mask() and .from() edge cases covered. Play→Scrobble integration verified with @MockBean (correct event passed). Coverage gate holds or improves.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: ScrobbleControllerTest — MockMvc for all 4 endpoints** `est:45min`
  WebMvcTest for ScrobbleController. GET /settings returns masked tokens. PUT /settings connects LB (token), LF (username+password → mock authenticate). PUT with blank token disconnects. PUT with bad LF creds → 400. DELETE /settings/lastfm and /settings/listenbrainz disconnect and return updated response. Use @WithMockUser + Principal pattern (Knowledge #9). Mock UserRepository and LastfmService.
  - Files: `musicode-server/src/test/java/com/musicode/controller/ScrobbleControllerTest.java`, `musicode-server/src/main/java/com/musicode/controller/ScrobbleController.java`
  - Verify: mvn test -pl musicode-server -Dtest=ScrobbleControllerTest — all tests green

- [x] **T02: ScrobbleSettingsResponse unit tests — mask() and from()** `est:15min`
  Pure unit tests for the DTO. mask(): null → null, short token (<=8 chars) → '****', normal token → first4…last4. from(): user with both tokens → both connected+masked, user with no tokens → both disconnected+null masks, user with blank tokens → disconnected.
  - Files: `musicode-server/src/test/java/com/musicode/model/dto/ScrobbleSettingsResponseTest.java`, `musicode-server/src/main/java/com/musicode/model/dto/ScrobbleSettingsResponse.java`
  - Verify: mvn test -pl musicode-server -Dtest=ScrobbleSettingsResponseTest — all green

- [x] **T03: Play→Scrobble integration test — verify scrobble invocation** `est:30min`
  @SpringBootTest integration test. Create user + track in DB, POST /api/plays/{trackId} with auth. Verify ScrobbleService.scrobble() was called with correct PlaybackEvent (matching user, track, timestamp). Use @MockBean ScrobbleService as the boundary — we already proved the wire works in S01. Also verify ActivityService.broadcast() was called.
  - Files: `musicode-server/src/test/java/com/musicode/controller/PlayScrobbleIntegrationTest.java`, `musicode-server/src/main/java/com/musicode/controller/PlayController.java`
  - Verify: mvn test -pl musicode-server -Dtest=PlayScrobbleIntegrationTest — all green

- [x] **T04: Coverage gate — verify no regression** `est:10min`
  Run full test suite with JaCoCo. Verify line/branch coverage meets or exceeds the configured gate. Fix any new gaps if gate fails.
  - Files: `musicode-server/pom.xml`
  - Verify: mvn verify -pl musicode-server — BUILD SUCCESS with JaCoCo gate passed

## Files Likely Touched

- musicode-server/src/test/java/com/musicode/controller/ScrobbleControllerTest.java
- musicode-server/src/main/java/com/musicode/controller/ScrobbleController.java
- musicode-server/src/test/java/com/musicode/model/dto/ScrobbleSettingsResponseTest.java
- musicode-server/src/main/java/com/musicode/model/dto/ScrobbleSettingsResponse.java
- musicode-server/src/test/java/com/musicode/controller/PlayScrobbleIntegrationTest.java
- musicode-server/src/main/java/com/musicode/controller/PlayController.java
- musicode-server/pom.xml
