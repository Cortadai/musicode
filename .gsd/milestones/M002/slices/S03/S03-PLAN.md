# S03: Test Suite Foundation

**Goal:** Establish test baseline: backend integration tests for API endpoints, frontend unit + reducer tests for player logic and utilities.
**Demo:** After this: npm test and mvn test both pass with meaningful coverage of core features.

## Tasks
- [x] **T01: Backend integration tests for all 4 REST controllers — 13 tests, all green.** — Why: No backend test coverage beyond a single MetadataServiceTest. Need integration tests using @SpringBootTest + MockMvc against H2 in-memory to verify API contracts.

Files: `musicode-server/src/test/java/com/musicode/controller/AlbumControllerTest.java`, `ArtistControllerTest.java`, `TrackControllerTest.java`, `SearchControllerTest.java`, `musicode-server/src/test/resources/application-test.properties`

Do:
1. Create `application-test.properties` with H2 in-memory config (`jdbc:h2:mem:testdb`) so tests don't touch the real DB.
2. Create a shared test data setup (use @Sql or @BeforeEach with repository injection) that inserts sample artists, albums, and tracks.
3. Write `AlbumControllerTest` — test GET /api/albums (paginated list), GET /api/albums/{id} (detail with tracks), GET /api/albums/999 (404).
4. Write `ArtistControllerTest` — test GET /api/artists (paginated list), GET /api/artists/{id} (detail with albums), GET /api/artists/999 (404).
5. Write `TrackControllerTest` — test GET /api/tracks (paginated list), GET /api/tracks/{id} (detail), GET /api/tracks/999 (404).
6. Write `SearchControllerTest` — test GET /api/search?q=term (returns matching results), GET /api/search?q= (empty query returns empty results).
7. Ensure all tests use @ActiveProfiles("test") or @AutoConfigureMockMvc.

Verify: `cd musicode-server && mvn test`
Done when: All controller tests pass, covering list/detail/not-found for each entity plus search.
  - Estimate: 1h
  - Files: musicode-server/src/test/java/com/musicode/controller/AlbumControllerTest.java, musicode-server/src/test/java/com/musicode/controller/ArtistControllerTest.java, musicode-server/src/test/java/com/musicode/controller/TrackControllerTest.java, musicode-server/src/test/java/com/musicode/controller/SearchControllerTest.java, musicode-server/src/test/resources/application-test.properties
  - Verify: cd musicode-server && mvn test -Dtest="AlbumControllerTest,ArtistControllerTest,TrackControllerTest,SearchControllerTest" -pl .
- [x] **T02: Frontend test setup with Vitest + 29 tests (7 format utility, 22 player reducer) — all green.** — Why: No frontend tests exist. PlayerContext reducer is the most complex frontend logic (shuffle, repeat modes, queue management). Utility functions like formatDuration also need coverage.

Files: `musicode-ui/src/context/PlayerContext.test.ts`, `musicode-ui/src/utils/format.test.ts`, `musicode-ui/package.json`, `musicode-ui/vite.config.ts`

Do:
1. Install Vitest and testing-library: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`.
2. Configure Vitest in vite.config.ts (add test config with jsdom environment).
3. Add `"test": "vitest run"` script to package.json.
4. Write `format.test.ts` — test formatDuration with various inputs: 0, 65 (→ '1:05'), null (→ '—'), large values.
5. Write `PlayerContext.test.ts` — extract and test the playerReducer directly:
   - PLAY_TRACK: sets currentTrack, queue, isPlaying
   - PAUSE / RESUME: toggles isPlaying
   - NEXT: advances queue, handles end-of-queue, handles repeat-all wrap, handles repeat-one restart
   - PREV: goes back, handles currentTime > 3s restart, handles repeat-all wrap to end
   - TOGGLE_SHUFFLE: shuffles queue keeping current track first, restores original order on unshuffle
   - TOGGLE_REPEAT: cycles off → all → one → off
   - SET_VOLUME: clamps to 0-1 range
   - STOP: resets to initial state preserving volume

Verify: `cd musicode-ui && npm test`
Done when: All reducer and utility tests pass. `npm test` exits 0.
  - Estimate: 1h
  - Files: musicode-ui/src/context/PlayerContext.test.ts, musicode-ui/src/utils/format.test.ts, musicode-ui/package.json, musicode-ui/vite.config.ts
  - Verify: cd musicode-ui && npm test
- [x] **T03: Full verification — 16 backend + 29 frontend tests all green.** — Why: Final verification that both test suites run cleanly together and no tests are flaky or dependent on machine state.

Files: none (verification-only task)

Do:
1. Run `cd musicode-server && mvn test` — all tests pass.
2. Run `cd musicode-ui && npm test` — all tests pass.
3. Fix any failures discovered.
4. Verify the existing MetadataServiceTest still passes (it depends on a local FLAC file — if it fails, skip it with @Disabled and a note, since it's machine-dependent).

Verify: `cd musicode-server && mvn test && cd ../musicode-ui && npm test`
Done when: Both `mvn test` and `npm test` exit 0 with all tests green.
  - Estimate: 15m
  - Files: musicode-server/src/test/java/com/musicode/service/MetadataServiceTest.java
  - Verify: cd musicode-server && mvn test && cd ../musicode-ui && npm test
