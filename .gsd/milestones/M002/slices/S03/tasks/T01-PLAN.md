---
estimated_steps: 12
estimated_files: 5
skills_used: []
---

# T01: Backend integration tests for REST API endpoints

Why: No backend test coverage beyond a single MetadataServiceTest. Need integration tests using @SpringBootTest + MockMvc against H2 in-memory to verify API contracts.

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

## Inputs

- `musicode-server/src/main/java/com/musicode/controller/*.java`
- `musicode-server/src/main/java/com/musicode/model/entity/*.java`
- `musicode-server/src/main/java/com/musicode/repository/*.java`

## Expected Output

- `musicode-server/src/test/java/com/musicode/controller/AlbumControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/ArtistControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/TrackControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/SearchControllerTest.java`
- `musicode-server/src/test/resources/application-test.properties`

## Verification

cd musicode-server && mvn test -Dtest="AlbumControllerTest,ArtistControllerTest,TrackControllerTest,SearchControllerTest" -pl .
