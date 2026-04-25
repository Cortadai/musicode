# Codebase Map

Generated: 2026-04-25T15:41:14Z | Files: 245 | Described: 0/245
<!-- gsd:codebase-meta {"generatedAt":"2026-04-25T15:41:14Z","fingerprint":"08be37e7f3824d06b8fbe23cc19ff5535a698eab","fileCount":245,"truncated":false} -->

### (root)/
- `.env.example`
- `.gitignore`
- `Caddyfile`
- `docker-compose.yml`
- `HANDOVER.md`
- `personal-media-player-proyecto.md`
- `PLAN.md`
- `README.md`

### .github/workflows/
- `.github/workflows/ci.yml`

### caddy/
- `caddy/Dockerfile`

### musicode-server/
- `musicode-server/.dockerignore`
- `musicode-server/.gitignore`
- `musicode-server/Dockerfile`
- `musicode-server/pom.xml`
- `musicode-server/README.md`

### musicode-server/src/main/java/com/musicode/
- `musicode-server/src/main/java/com/musicode/MusicodeApplication.java`

### musicode-server/src/main/java/com/musicode/config/
- `musicode-server/src/main/java/com/musicode/config/AdminSeeder.java`
- `musicode-server/src/main/java/com/musicode/config/AsyncConfig.java`
- `musicode-server/src/main/java/com/musicode/config/JacksonConfig.java`
- `musicode-server/src/main/java/com/musicode/config/LastfmConfig.java`
- `musicode-server/src/main/java/com/musicode/config/OpenApiConfig.java`
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`
- `musicode-server/src/main/java/com/musicode/config/TokenMigrationRunner.java`
- `musicode-server/src/main/java/com/musicode/config/WebConfig.java`

### musicode-server/src/main/java/com/musicode/controller/
- `musicode-server/src/main/java/com/musicode/controller/ActivityController.java`
- `musicode-server/src/main/java/com/musicode/controller/AlbumController.java`
- `musicode-server/src/main/java/com/musicode/controller/ArtistController.java`
- `musicode-server/src/main/java/com/musicode/controller/AuthController.java`
- `musicode-server/src/main/java/com/musicode/controller/CoverArtController.java`
- `musicode-server/src/main/java/com/musicode/controller/LibraryController.java`
- `musicode-server/src/main/java/com/musicode/controller/LibraryHealthController.java`
- `musicode-server/src/main/java/com/musicode/controller/PlayController.java`
- `musicode-server/src/main/java/com/musicode/controller/ScrobbleController.java`
- `musicode-server/src/main/java/com/musicode/controller/SearchController.java`
- `musicode-server/src/main/java/com/musicode/controller/StatsController.java`
- `musicode-server/src/main/java/com/musicode/controller/StreamController.java`
- `musicode-server/src/main/java/com/musicode/controller/TrackController.java`
- `musicode-server/src/main/java/com/musicode/controller/UserController.java`

### musicode-server/src/main/java/com/musicode/exception/
- `musicode-server/src/main/java/com/musicode/exception/BadRequestException.java`
- `musicode-server/src/main/java/com/musicode/exception/ConflictException.java`
- `musicode-server/src/main/java/com/musicode/exception/ErrorResponse.java`
- `musicode-server/src/main/java/com/musicode/exception/GlobalExceptionHandler.java`
- `musicode-server/src/main/java/com/musicode/exception/ResourceNotFoundException.java`

### musicode-server/src/main/java/com/musicode/filter/
- `musicode-server/src/main/java/com/musicode/filter/JwtAuthFilter.java`
- `musicode-server/src/main/java/com/musicode/filter/LoginRateLimitFilter.java`
- `musicode-server/src/main/java/com/musicode/filter/RequestIdFilter.java`

### musicode-server/src/main/java/com/musicode/model/dto/
- `musicode-server/src/main/java/com/musicode/model/dto/ActivityEvent.java`
- `musicode-server/src/main/java/com/musicode/model/dto/CreateUserRequest.java`
- `musicode-server/src/main/java/com/musicode/model/dto/DailyPlayCount.java`
- `musicode-server/src/main/java/com/musicode/model/dto/HealthIssue.java`
- `musicode-server/src/main/java/com/musicode/model/dto/HealthIssueType.java`
- `musicode-server/src/main/java/com/musicode/model/dto/HealthSummary.java`
- `musicode-server/src/main/java/com/musicode/model/dto/LoginRequest.java`
- `musicode-server/src/main/java/com/musicode/model/dto/ScanStatus.java`
- `musicode-server/src/main/java/com/musicode/model/dto/ScrobbleResult.java`
- `musicode-server/src/main/java/com/musicode/model/dto/ScrobbleSettingsRequest.java`
- `musicode-server/src/main/java/com/musicode/model/dto/ScrobbleSettingsResponse.java`
- `musicode-server/src/main/java/com/musicode/model/dto/SearchResults.java`
- `musicode-server/src/main/java/com/musicode/model/dto/StatsSummary.java`
- `musicode-server/src/main/java/com/musicode/model/dto/TokenPair.java`
- `musicode-server/src/main/java/com/musicode/model/dto/TopAlbumStat.java`
- `musicode-server/src/main/java/com/musicode/model/dto/TopArtistStat.java`
- `musicode-server/src/main/java/com/musicode/model/dto/TopTrackStat.java`
- `musicode-server/src/main/java/com/musicode/model/dto/TrackMetadata.java`
- `musicode-server/src/main/java/com/musicode/model/dto/UpdateUserRequest.java`
- `musicode-server/src/main/java/com/musicode/model/dto/UserResponse.java`

### musicode-server/src/main/java/com/musicode/model/entity/
- `musicode-server/src/main/java/com/musicode/model/entity/Album.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Artist.java`
- `musicode-server/src/main/java/com/musicode/model/entity/LibraryFolder.java`
- `musicode-server/src/main/java/com/musicode/model/entity/PlaybackEvent.java`
- `musicode-server/src/main/java/com/musicode/model/entity/RefreshToken.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Role.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Track.java`
- `musicode-server/src/main/java/com/musicode/model/entity/User.java`

### musicode-server/src/main/java/com/musicode/repository/
- `musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/ArtistRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/LibraryFolderRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/PlaybackEventRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/RefreshTokenRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/TrackRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/UserRepository.java`

### musicode-server/src/main/java/com/musicode/service/
- `musicode-server/src/main/java/com/musicode/service/ActivityService.java`
- `musicode-server/src/main/java/com/musicode/service/AudioStreamService.java`
- `musicode-server/src/main/java/com/musicode/service/AuthService.java`
- `musicode-server/src/main/java/com/musicode/service/CoverArtService.java`
- `musicode-server/src/main/java/com/musicode/service/JwtService.java`
- `musicode-server/src/main/java/com/musicode/service/LastfmService.java`
- `musicode-server/src/main/java/com/musicode/service/LibraryHealthService.java`
- `musicode-server/src/main/java/com/musicode/service/LibraryScanService.java`
- `musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java`
- `musicode-server/src/main/java/com/musicode/service/MetadataService.java`
- `musicode-server/src/main/java/com/musicode/service/MusicodeUserDetailsService.java`
- `musicode-server/src/main/java/com/musicode/service/RefreshTokenService.java`
- `musicode-server/src/main/java/com/musicode/service/ScrobbleService.java`
- `musicode-server/src/main/java/com/musicode/service/StatsService.java`
- `musicode-server/src/main/java/com/musicode/service/TokenEncryptionService.java`

### musicode-server/src/main/java/com/musicode/util/
- `musicode-server/src/main/java/com/musicode/util/CookieUtil.java`
- `musicode-server/src/main/java/com/musicode/util/EncryptedStringConverter.java`
- `musicode-server/src/main/java/com/musicode/util/TokenHashUtil.java`

### musicode-server/src/main/resources/
- `musicode-server/src/main/resources/application-docker.yml`
- `musicode-server/src/main/resources/application.yml`
- `musicode-server/src/main/resources/logback-spring.xml`

### musicode-server/src/main/resources/db/migration/
- `musicode-server/src/main/resources/db/migration/V1__baseline.sql`

### musicode-server/src/main/resources/static/
- `musicode-server/src/main/resources/static/test.html`

### musicode-server/src/test/java/com/musicode/config/
- `musicode-server/src/test/java/com/musicode/config/AdminSeederTest.java`
- `musicode-server/src/test/java/com/musicode/config/TokenMigrationRunnerTest.java`

### musicode-server/src/test/java/com/musicode/controller/
- `musicode-server/src/test/java/com/musicode/controller/AlbumControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/ArtistControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/AuthControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/CoverArtControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/LibraryControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/LibraryHealthControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/PlayControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/PlayScrobbleIntegrationTest.java`
- `musicode-server/src/test/java/com/musicode/controller/ScrobbleControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/SearchControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/StatsControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/TrackControllerTest.java`
- `musicode-server/src/test/java/com/musicode/controller/UserControllerTest.java`

### musicode-server/src/test/java/com/musicode/filter/
- `musicode-server/src/test/java/com/musicode/filter/LoginRateLimitFilterTest.java`

### musicode-server/src/test/java/com/musicode/model/dto/
- `musicode-server/src/test/java/com/musicode/model/dto/ScanStatusTest.java`
- `musicode-server/src/test/java/com/musicode/model/dto/ScrobbleSettingsResponseTest.java`

### musicode-server/src/test/java/com/musicode/repository/
- `musicode-server/src/test/java/com/musicode/repository/UserRepositoryTest.java`

### musicode-server/src/test/java/com/musicode/service/
- `musicode-server/src/test/java/com/musicode/service/ActivityServiceTest.java`
- `musicode-server/src/test/java/com/musicode/service/AudioStreamServiceTest.java`
- `musicode-server/src/test/java/com/musicode/service/JwtServiceTest.java`
- `musicode-server/src/test/java/com/musicode/service/LastfmServiceTest.java`
- `musicode-server/src/test/java/com/musicode/service/LastfmServiceWireMockTest.java`
- `musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceTest.java`
- `musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceWireMockTest.java`
- `musicode-server/src/test/java/com/musicode/service/MetadataServiceTest.java`
- `musicode-server/src/test/java/com/musicode/service/MusicodeUserDetailsServiceTest.java`
- `musicode-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java`
- `musicode-server/src/test/java/com/musicode/service/StatsServiceTest.java`
- `musicode-server/src/test/java/com/musicode/service/TokenEncryptionServiceTest.java`

### musicode-server/src/test/java/com/musicode/util/
- `musicode-server/src/test/java/com/musicode/util/EncryptedStringConverterTest.java`

### musicode-server/src/test/resources/
- `musicode-server/src/test/resources/application-test.yml`

### musicode-server/src/test/resources/testdata/
- `musicode-server/src/test/resources/testdata/test-track-2.flac`
- `musicode-server/src/test/resources/testdata/test-track.flac`
- `musicode-server/src/test/resources/testdata/test-track.mp3`

### musicode-ui/
- `musicode-ui/.dockerignore`
- `musicode-ui/.gitignore`
- `musicode-ui/Dockerfile`
- `musicode-ui/eslint.config.js`
- `musicode-ui/index.html`
- `musicode-ui/nginx.conf`
- `musicode-ui/package-lock.json`
- `musicode-ui/package.json`
- `musicode-ui/playwright.config.ts`
- `musicode-ui/README.md`
- `musicode-ui/tsconfig.app.json`
- `musicode-ui/tsconfig.json`
- `musicode-ui/tsconfig.node.json`
- `musicode-ui/vite.config.ts`

### musicode-ui/e2e/
- `musicode-ui/e2e/admin.spec.ts`
- `musicode-ui/e2e/browse.spec.ts`
- `musicode-ui/e2e/error-states.spec.ts`
- `musicode-ui/e2e/helpers.ts`
- `musicode-ui/e2e/login.spec.ts`
- `musicode-ui/e2e/navigation.spec.ts`
- `musicode-ui/e2e/playback.spec.ts`
- `musicode-ui/e2e/search.spec.ts`
- `musicode-ui/e2e/settings.spec.ts`
- `musicode-ui/e2e/smoke.spec.ts`
- `musicode-ui/e2e/stats.spec.ts`

### musicode-ui/public/
- `musicode-ui/public/manifest.json`
- `musicode-ui/public/sw.js`

### musicode-ui/src/
- `musicode-ui/src/App.tsx`
- `musicode-ui/src/index.css`
- `musicode-ui/src/main.tsx`
- `musicode-ui/src/test-setup.ts`

### musicode-ui/src/api/
- `musicode-ui/src/api/activity.ts`
- `musicode-ui/src/api/albums.ts`
- `musicode-ui/src/api/artists.ts`
- `musicode-ui/src/api/auth.ts`
- `musicode-ui/src/api/client.ts`
- `musicode-ui/src/api/health.ts`
- `musicode-ui/src/api/library.ts`
- `musicode-ui/src/api/plays.ts`
- `musicode-ui/src/api/scrobble.ts`
- `musicode-ui/src/api/search.ts`
- `musicode-ui/src/api/stats.ts`
- `musicode-ui/src/api/tracks.ts`

### musicode-ui/src/audio/
- `musicode-ui/src/audio/audioGraph.ts`
- `musicode-ui/src/audio/audioPreferences.test.ts`
- `musicode-ui/src/audio/audioPreferences.ts`
- `musicode-ui/src/audio/colorExtraction.test.ts`
- `musicode-ui/src/audio/colorExtraction.ts`
- `musicode-ui/src/audio/eqProcessor.ts`

### musicode-ui/src/components/activity/
- `musicode-ui/src/components/activity/ActivityFeed.tsx`

### musicode-ui/src/components/auth/
- `musicode-ui/src/components/auth/ProtectedRoute.tsx`

### musicode-ui/src/components/common/
- `musicode-ui/src/components/common/ErrorBoundary.tsx`
- `musicode-ui/src/components/common/ErrorMessage.tsx`
- `musicode-ui/src/components/common/Spinner.tsx`

### musicode-ui/src/components/layout/
- `musicode-ui/src/components/layout/AppShell.tsx`
- `musicode-ui/src/components/layout/Sidebar.tsx`
- `musicode-ui/src/components/layout/TopBar.tsx`

### musicode-ui/src/components/library/
- `musicode-ui/src/components/library/AlbumCard.tsx`
- `musicode-ui/src/components/library/TrackList.tsx`

### musicode-ui/src/components/player/
- `musicode-ui/src/components/player/CrossfadePopover.test.tsx`
- `musicode-ui/src/components/player/CrossfadePopover.tsx`
- `musicode-ui/src/components/player/EqPopover.test.tsx`
- `musicode-ui/src/components/player/EqPopover.tsx`
- `musicode-ui/src/components/player/NowPlayingOverlay.tsx`
- `musicode-ui/src/components/player/PlayerBar.tsx`
- `musicode-ui/src/components/player/ProgressBar.test.tsx`
- `musicode-ui/src/components/player/ProgressBar.tsx`
- `musicode-ui/src/components/player/ScrobbleIndicator.tsx`
- `musicode-ui/src/components/player/TrackInfo.test.tsx`
- `musicode-ui/src/components/player/TrackInfo.tsx`
- `musicode-ui/src/components/player/TransportControls.test.tsx`
- `musicode-ui/src/components/player/TransportControls.tsx`
- `musicode-ui/src/components/player/VinylVisualizer.tsx`
- `musicode-ui/src/components/player/Visualizer.tsx`
- `musicode-ui/src/components/player/VolumeControl.test.tsx`
- `musicode-ui/src/components/player/VolumeControl.tsx`

### musicode-ui/src/context/
- `musicode-ui/src/context/AuthContext.test.ts`
- `musicode-ui/src/context/AuthContext.tsx`
- `musicode-ui/src/context/PlayerContext.test.ts`
- `musicode-ui/src/context/PlayerContext.tsx`

### musicode-ui/src/hooks/
- `musicode-ui/src/hooks/useDynamicTheme.ts`
- `musicode-ui/src/hooks/useGapless.ts`
- `musicode-ui/src/hooks/useMediaSession.ts`
- `musicode-ui/src/hooks/usePlayer.ts`
- `musicode-ui/src/hooks/useScrobble.ts`

### musicode-ui/src/pages/
- `musicode-ui/src/pages/AlbumDetailPage.tsx`
- `musicode-ui/src/pages/AlbumsPage.tsx`
- `musicode-ui/src/pages/ArtistDetailPage.tsx`
- `musicode-ui/src/pages/ArtistsPage.tsx`
- `musicode-ui/src/pages/LibraryHealthPage.tsx`
- `musicode-ui/src/pages/LoginPage.tsx`
- `musicode-ui/src/pages/SearchPage.tsx`
- `musicode-ui/src/pages/SettingsPage.tsx`
- `musicode-ui/src/pages/StatsPage.tsx`
- `musicode-ui/src/pages/TracksPage.tsx`
- `musicode-ui/src/pages/UsersPage.tsx`

### musicode-ui/src/types/
- `musicode-ui/src/types/index.ts`

### musicode-ui/src/utils/
- `musicode-ui/src/utils/errors.test.ts`
- `musicode-ui/src/utils/errors.ts`
- `musicode-ui/src/utils/format.test.ts`
- `musicode-ui/src/utils/format.ts`

### scripts/
- `scripts/configure-scrobble.ps1`
- `scripts/get-lastfm-session.ps1`
- `scripts/register-and-scan.ps1`
- `scripts/verify-scrobble.ps1`
