# Project Knowledge

Append-only register of project-specific rules, patterns, and lessons learned.
Agents read this before every unit. Add entries when you discover something worth remembering.

## Rules

| # | Scope | Rule | Why | Added |
|---|-------|------|-----|-------|
| 1 | server | Always kill all `java.exe` processes before starting Spring Boot | H2 file-mode DB locks the `.mv.db` file exclusively. Zombie Java processes from crashed bg_shell instances hold the lock and prevent restart. Use `wmic process where "name='java.exe'" delete` on Windows — `taskkill /F` sometimes fails silently. | S02 |
| 2 | server | Never set `spring.jpa.open-in-view: true` | We use jackson-datatype-hibernate6 instead. Lazy proxies serialize as `null` in list endpoints, EntityGraph loads collections for detail endpoints. open-in-view masks real session issues. | S02 |
| 3 | entities | Artist collections must be `Set`, not `List` | Hibernate throws `MultipleBagFetchException` when fetching two `List` (bag) collections simultaneously via EntityGraph. `Set` avoids this. Album.tracks can stay as `List` since it's the only collection on Album. | S02 |
| 4 | services (external APIs) | External API URLs must be `@Value`-injected fields with a public default, never hardcoded constants | Tests need to redirect the service to a local WireMock server without touching production behavior. A hardcoded `private static final String API_URL = "https://..."` forces test-only reflection hacks; a `@Value("${lastfm.api.url:https://...}")` field stays identical in prod and trivial to override in `@TestPropertySource`. | M008/S01 |
| 5 | tests | External API services get both Mockito unit tests AND WireMock contract tests | Mockito tests verify service logic (provider selection, retry, error mapping) but cannot see the wire — they can't catch a wrong request body (e.g. `Map.of` producing `{}`), a malformed signature, or missing headers. WireMock stubs validate the actual bytes sent and the JSON/form payload shape. Both layers are required for any service that talks to a third party. | M008/S01 |

## Patterns

| # | Pattern | Where | Notes |
|---|---------|-------|-------|
| 1 | EntityGraph for detail, Hibernate6Module for lists | AlbumRepository, ArtistRepository, JacksonConfig | Detail endpoints use `@EntityGraph(attributePaths=...)` on custom finder methods (`findWithTracksById`). List endpoints let lazy collections serialize as `null` via Hibernate6Module. |
| 2 | HTTP Range streaming with RandomAccessFile | AudioStreamService | Parse `Range: bytes=start-end` header, return 206 with `Content-Range`. Supports open-ended (`bytes=1024-`), suffix (`bytes=-512`), and explicit ranges. Single-range only — browsers don't use multi-range for audio. |
| 3 | Cover art cached as `{albumId}.jpg` on disk | CoverArtService, CoverArtController | Extracted during scan, served via `/api/covers/{albumId}` with `Cache-Control: max-age=604800` (7 days). Skip extraction if file already exists. |
| 4 | Content-Type from file extension | AudioStreamService.resolveContentType | `.flac`→`audio/flac`, `.mp3`→`audio/mpeg`, `.ogg`→`audio/ogg`, `.m4a`→`audio/mp4`, `.wav`→`audio/wav`. |
| 5 | ALBUM_ARTIST for album grouping | LibraryScanService.processFile | Albums keyed by `(title, albumArtist)` not `(title, trackArtist)`. Prevents compilation/collab albums from fragmenting. Falls back to track artist when ALBUM_ARTIST tag absent. |
| 6 | Play tracking at 50% threshold | usePlayer.ts, PlayController | Frontend fires `POST /api/plays/{id}` once when `currentTime > duration * 0.5`. Uses `currentTrackRef` to avoid stale closures in timeupdate handler. `playReportedRef` prevents duplicate reports per track. |
| 7 | Async scrobbling with fire-and-forget | ScrobbleService, PlayController | `@Async` method called from controller after save. Retry with exponential backoff (1s→2s→4s, max 3). Never blocks playback response. Never throws — logs and moves on. |
| 8 | SSE with CopyOnWriteArrayList for emitters | ActivityService | Read-heavy (broadcast to N clients), write-rare (add/remove emitters). Dead emitters collected during broadcast. `ConcurrentLinkedDeque` for recent event buffer (last 20). |
| 9 | `java.security.Principal` for controller auth | PlayController, StatsController, ScrobbleController | Use `Principal principal` + `principal.getName()` instead of `@AuthenticationPrincipal String`. Works correctly with both real JWT auth and `@WithMockUser` in tests. |
| 10 | WireMock-backed HTTP contract tests for third-party services | LastfmServiceWireMockTest, ListenBrainzServiceWireMockTest | `@SpringBootTest` with `@TestPropertySource` overrides the injected `*.api.url` to point at a per-test WireMock server (`new WireMockServer(options().dynamicPort())`). Stubs assert request body/headers/signature and return 2xx/4xx/5xx / connection resets. Complements Mockito unit tests — Mockito covers logic, WireMock covers wire format. |
| 11 | `ReflectionTestUtils.setField` for swapping inline-constructed dependencies | ScrobbleServiceTest | When a service constructs a non-trivial collaborator inline (e.g. `new RestTemplate()`) and you don't want to refactor production code for a test-only injection point, use `ReflectionTestUtils.setField(service, "fieldName", mock)`. Acceptable for focused test doubles; prefer proper DI for anything reused. |

## Lessons Learned

| # | What Happened | Root Cause | Fix | Scope |
|---|--------------|------------|-----|-------|
| 1 | `LazyInitializationException` when serializing Album list endpoint | `Album.tracks` is lazy (default for `@OneToMany`), Jackson tries to access it outside Hibernate session, `open-in-view` is disabled | Added `jackson-datatype-hibernate6` with `Hibernate6Module` — writes `null` for uninitialized proxies instead of throwing | S02 |
| 2 | `MultipleBagFetchException` on Artist detail with EntityGraph `{albums, tracks}` | Hibernate cannot simultaneously fetch two `List` (bag) typed collections in a single query | Changed `Artist.albums` and `Artist.tracks` from `List` to `Set` | S02 |
| 3 | H2 database lock prevents Spring Boot startup after unclean shutdown | H2 file-mode acquires exclusive lock on `.mv.db`. Crashed/killed Java processes don't release it. `taskkill /F` on Windows sometimes doesn't kill the process. | Use `wmic process where "name='java.exe'" delete` to force kill, then retry. The `.lock.db` file is a symptom, not the cause — the `.mv.db` file itself is locked by the OS. | S01-S02 |
| 4 | JAudioTagger 3.x not available in Maven Central | The artifact `net.jthink:jaudiotagger:3.x` doesn't exist in standard repos | Use `jaudiotagger:2.2.5` — works fine for FLAC/MP3/OGG metadata reading | S01 |
| 5 | springdoc-openapi 2.8.15+ fails with Spring Boot 3.4.4 | Invalid mapping pattern `/swagger-ui/**/*swagger-initializer.js` — Spring Boot 3.4 path matching rejects `**` followed by more segments | Pin to springdoc `2.8.14`. GitHub issue #3210 confirms the bug. | M006/S01 |
| 6 | `@AuthenticationPrincipal String` returns null with `@WithMockUser` | `@WithMockUser` sets principal as Spring Security `User` object, not a raw `String`. `@AuthenticationPrincipal` extracts the principal directly — type mismatch returns null. | Use `java.security.Principal` + `principal.getName()` — works with both real JWT and mock auth. | M007/S01 |
| 7 | PlaybackEvent FK causes cascade failures in existing tests | Adding `PlaybackEvent` with FK to `User` and `Track` means `deleteAll()` on users or tracks in test setUp fails with FK violation. | Add `playbackEventRepository.deleteAll()` before any `userRepository.deleteAll()` or `trackRepository.deleteAll()` in all test setUp methods. Same pattern as RefreshToken cleanup. | M007/S01 |
| 8 | Album fragmentation from compilation/collab tags | Scanner grouped by `(albumTitle, trackArtist)`. Compilations with different artist per track created N album entries for the same album. | Read `ALBUM_ARTIST` tag from metadata, use it for album grouping. Falls back to track artist. Post-scan cleanup removes orphan albums/artists. Reduced 161→123 albums. 10 remaining need manual tag fix. | M007 |
| 9 | `OffscreenCanvas` with zero dimension kills rAF loop; grid text blurry | During CSS height transition (0→100px), canvas reports 0 height. `new OffscreenCanvas(w, 0)` throws `DOMException` that silently kills the animation loop. Separately, grid cache drawn at 1× CSS resolution but displayed on DPR-scaled canvas causes blurry text. | Guard: skip frames where canvas < 2px, try-catch the rAF callback. DPR: create OffscreenCanvas at `w*dpr × h*dpr`, apply `ctx.scale(dpr, dpr)`, draw at CSS coordinates. Invalidate cache on DPR change. | M020/S01 |
