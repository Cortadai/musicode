# Codebase Map

Generated: 2026-05-10T13:40:21Z | Files: 377 | Described: 0/377
<!-- gsd:codebase-meta {"generatedAt":"2026-05-10T13:40:21Z","fingerprint":"e0c204c4a934dc4c2d83468d8e3ccf0a02ada3da","fileCount":377,"truncated":false} -->

### (root)/
- `.env.example`
- `.gitignore`
- `Caddyfile`
- `docker-compose.yml`
- `README.md`
- `SCROBBLING.md`
- `start-sonance.bat`
- `start-sonance.ps1`
- `stop-sonance.bat`
- `stop-sonance.ps1`

### .github/workflows/
- `.github/workflows/ci.yml`

### caddy/
- `caddy/Dockerfile`

### scripts/
- `scripts/configure-scrobble.ps1`
- `scripts/get-lastfm-session.ps1`
- `scripts/register-and-scan.ps1`
- `scripts/verify-scrobble.ps1`

### sonance-server/
- `sonance-server/.dockerignore`
- `sonance-server/.gitignore`
- `sonance-server/Dockerfile`
- `sonance-server/pom.xml`
- `sonance-server/README.md`

### sonance-server/src/main/java/com/musicode/
- `sonance-server/src/main/java/com/musicode/MusicodeApplication.java`

### sonance-server/src/main/java/com/musicode/config/
- `sonance-server/src/main/java/com/musicode/config/AdminSeeder.java`
- `sonance-server/src/main/java/com/musicode/config/AsyncConfig.java`
- `sonance-server/src/main/java/com/musicode/config/JacksonConfig.java`
- `sonance-server/src/main/java/com/musicode/config/LastfmConfig.java`
- `sonance-server/src/main/java/com/musicode/config/OpenApiConfig.java`
- `sonance-server/src/main/java/com/musicode/config/SecurityConfig.java`
- `sonance-server/src/main/java/com/musicode/config/TokenMigrationRunner.java`
- `sonance-server/src/main/java/com/musicode/config/WebConfig.java`

### sonance-server/src/main/java/com/musicode/controller/
- `sonance-server/src/main/java/com/musicode/controller/ActivityController.java`
- `sonance-server/src/main/java/com/musicode/controller/AlbumController.java`
- `sonance-server/src/main/java/com/musicode/controller/ArtistController.java`
- `sonance-server/src/main/java/com/musicode/controller/AuthController.java`
- `sonance-server/src/main/java/com/musicode/controller/CoverArtController.java`
- `sonance-server/src/main/java/com/musicode/controller/FavoriteController.java`
- `sonance-server/src/main/java/com/musicode/controller/LibraryController.java`
- `sonance-server/src/main/java/com/musicode/controller/LibraryHealthController.java`
- `sonance-server/src/main/java/com/musicode/controller/LyricsController.java`
- `sonance-server/src/main/java/com/musicode/controller/PlayController.java`
- `sonance-server/src/main/java/com/musicode/controller/PlaylistController.java`
- `sonance-server/src/main/java/com/musicode/controller/ScrobbleController.java`
- `sonance-server/src/main/java/com/musicode/controller/SearchController.java`
- `sonance-server/src/main/java/com/musicode/controller/StatsController.java`
- `sonance-server/src/main/java/com/musicode/controller/StreamController.java`
- `sonance-server/src/main/java/com/musicode/controller/TrackController.java`
- `sonance-server/src/main/java/com/musicode/controller/UserController.java`
- `sonance-server/src/main/java/com/musicode/controller/WaveformController.java`

### sonance-server/src/main/java/com/musicode/exception/
- `sonance-server/src/main/java/com/musicode/exception/BadRequestException.java`
- `sonance-server/src/main/java/com/musicode/exception/ConflictException.java`
- `sonance-server/src/main/java/com/musicode/exception/ErrorResponse.java`
- `sonance-server/src/main/java/com/musicode/exception/GlobalExceptionHandler.java`
- `sonance-server/src/main/java/com/musicode/exception/ResourceNotFoundException.java`

### sonance-server/src/main/java/com/musicode/filter/
- `sonance-server/src/main/java/com/musicode/filter/JwtAuthFilter.java`
- `sonance-server/src/main/java/com/musicode/filter/LoginRateLimitFilter.java`
- `sonance-server/src/main/java/com/musicode/filter/RequestIdFilter.java`

### sonance-server/src/main/java/com/musicode/model/dto/
- *(29 files: 29 .java)*

### sonance-server/src/main/java/com/musicode/model/entity/
- `sonance-server/src/main/java/com/musicode/model/entity/Album.java`
- `sonance-server/src/main/java/com/musicode/model/entity/Artist.java`
- `sonance-server/src/main/java/com/musicode/model/entity/Favorite.java`
- `sonance-server/src/main/java/com/musicode/model/entity/LibraryFolder.java`
- `sonance-server/src/main/java/com/musicode/model/entity/LyricsStatus.java`
- `sonance-server/src/main/java/com/musicode/model/entity/PlaybackEvent.java`
- `sonance-server/src/main/java/com/musicode/model/entity/Playlist.java`
- `sonance-server/src/main/java/com/musicode/model/entity/PlaylistTrack.java`
- `sonance-server/src/main/java/com/musicode/model/entity/RefreshToken.java`
- `sonance-server/src/main/java/com/musicode/model/entity/Role.java`
- `sonance-server/src/main/java/com/musicode/model/entity/Track.java`
- `sonance-server/src/main/java/com/musicode/model/entity/User.java`

### sonance-server/src/main/java/com/musicode/repository/
- `sonance-server/src/main/java/com/musicode/repository/AlbumRepository.java`
- `sonance-server/src/main/java/com/musicode/repository/ArtistRepository.java`
- `sonance-server/src/main/java/com/musicode/repository/FavoriteRepository.java`
- `sonance-server/src/main/java/com/musicode/repository/LibraryFolderRepository.java`
- `sonance-server/src/main/java/com/musicode/repository/PlaybackEventRepository.java`
- `sonance-server/src/main/java/com/musicode/repository/PlaylistRepository.java`
- `sonance-server/src/main/java/com/musicode/repository/PlaylistTrackRepository.java`
- `sonance-server/src/main/java/com/musicode/repository/RefreshTokenRepository.java`
- `sonance-server/src/main/java/com/musicode/repository/TrackRepository.java`
- `sonance-server/src/main/java/com/musicode/repository/UserRepository.java`

### sonance-server/src/main/java/com/musicode/service/
- `sonance-server/src/main/java/com/musicode/service/ActivityService.java`
- `sonance-server/src/main/java/com/musicode/service/AudioStreamService.java`
- `sonance-server/src/main/java/com/musicode/service/AuthService.java`
- `sonance-server/src/main/java/com/musicode/service/CoverArtService.java`
- `sonance-server/src/main/java/com/musicode/service/JwtService.java`
- `sonance-server/src/main/java/com/musicode/service/LastfmService.java`
- `sonance-server/src/main/java/com/musicode/service/LibraryHealthService.java`
- `sonance-server/src/main/java/com/musicode/service/LibraryScanService.java`
- `sonance-server/src/main/java/com/musicode/service/ListenBrainzService.java`
- `sonance-server/src/main/java/com/musicode/service/LyricsService.java`
- `sonance-server/src/main/java/com/musicode/service/MetadataService.java`
- `sonance-server/src/main/java/com/musicode/service/MusicodeUserDetailsService.java`
- `sonance-server/src/main/java/com/musicode/service/PlaylistService.java`
- `sonance-server/src/main/java/com/musicode/service/RefreshTokenService.java`
- `sonance-server/src/main/java/com/musicode/service/ScrobbleService.java`
- `sonance-server/src/main/java/com/musicode/service/StatsService.java`
- `sonance-server/src/main/java/com/musicode/service/TokenEncryptionService.java`
- `sonance-server/src/main/java/com/musicode/service/WaveformService.java`

### sonance-server/src/main/java/com/musicode/util/
- `sonance-server/src/main/java/com/musicode/util/CookieUtil.java`
- `sonance-server/src/main/java/com/musicode/util/EncryptedStringConverter.java`
- `sonance-server/src/main/java/com/musicode/util/TokenHashUtil.java`

### sonance-server/src/main/resources/
- `sonance-server/src/main/resources/application-docker.yml`
- `sonance-server/src/main/resources/application.yml`
- `sonance-server/src/main/resources/logback-spring.xml`

### sonance-server/src/main/resources/db/migration/
- `sonance-server/src/main/resources/db/migration/V1__baseline.sql`
- `sonance-server/src/main/resources/db/migration/V2__add_lyrics_columns.sql`
- `sonance-server/src/main/resources/db/migration/V3__user_favorites.sql`
- `sonance-server/src/main/resources/db/migration/V4__playlists.sql`

### sonance-server/src/main/resources/static/
- `sonance-server/src/main/resources/static/test.html`

### sonance-server/src/test/java/com/musicode/config/
- `sonance-server/src/test/java/com/musicode/config/AdminSeederTest.java`
- `sonance-server/src/test/java/com/musicode/config/TokenMigrationRunnerTest.java`

### sonance-server/src/test/java/com/musicode/controller/
- `sonance-server/src/test/java/com/musicode/controller/AlbumControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/ArtistControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/AuthControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/CoverArtControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/LibraryControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/LibraryHealthControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/LyricsControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/PlayControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/PlaylistControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/PlayScrobbleIntegrationTest.java`
- `sonance-server/src/test/java/com/musicode/controller/ScrobbleControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/SearchControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/StatsControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/TrackControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/UserControllerTest.java`
- `sonance-server/src/test/java/com/musicode/controller/WaveformControllerTest.java`

### sonance-server/src/test/java/com/musicode/filter/
- `sonance-server/src/test/java/com/musicode/filter/LoginRateLimitFilterTest.java`

### sonance-server/src/test/java/com/musicode/model/dto/
- `sonance-server/src/test/java/com/musicode/model/dto/ScanStatusTest.java`
- `sonance-server/src/test/java/com/musicode/model/dto/ScrobbleSettingsResponseTest.java`

### sonance-server/src/test/java/com/musicode/repository/
- `sonance-server/src/test/java/com/musicode/repository/UserRepositoryTest.java`

### sonance-server/src/test/java/com/musicode/service/
- `sonance-server/src/test/java/com/musicode/service/ActivityServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/AudioStreamServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/JwtServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/LastfmServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/LastfmServiceWireMockTest.java`
- `sonance-server/src/test/java/com/musicode/service/ListenBrainzServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/ListenBrainzServiceWireMockTest.java`
- `sonance-server/src/test/java/com/musicode/service/LyricsServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/MetadataServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/MusicodeUserDetailsServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/ScrobbleServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/StatsServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/TokenEncryptionServiceTest.java`
- `sonance-server/src/test/java/com/musicode/service/WaveformServiceIntegrationTest.java`
- `sonance-server/src/test/java/com/musicode/service/WaveformServiceTest.java`

### sonance-server/src/test/java/com/musicode/util/
- `sonance-server/src/test/java/com/musicode/util/EncryptedStringConverterTest.java`

### sonance-server/src/test/resources/
- `sonance-server/src/test/resources/application-test.yml`

### sonance-server/src/test/resources/testdata/
- `sonance-server/src/test/resources/testdata/test-track-2.flac`
- `sonance-server/src/test/resources/testdata/test-track.flac`
- `sonance-server/src/test/resources/testdata/test-track.mp3`

### sonance-ui/
- `sonance-ui/.dockerignore`
- `sonance-ui/.gitignore`
- `sonance-ui/Dockerfile`
- `sonance-ui/eslint.config.js`
- `sonance-ui/index.html`
- `sonance-ui/nginx.conf`
- `sonance-ui/package-lock.json`
- `sonance-ui/package.json`
- `sonance-ui/playwright.config.ts`
- `sonance-ui/README.md`
- `sonance-ui/tsconfig.app.json`
- `sonance-ui/tsconfig.json`
- `sonance-ui/tsconfig.node.json`
- `sonance-ui/vite.config.ts`

### sonance-ui/e2e/
- `sonance-ui/e2e/admin.spec.ts`
- `sonance-ui/e2e/browse.spec.ts`
- `sonance-ui/e2e/error-states.spec.ts`
- `sonance-ui/e2e/helpers.ts`
- `sonance-ui/e2e/login.spec.ts`
- `sonance-ui/e2e/navigation.spec.ts`
- `sonance-ui/e2e/playback.spec.ts`
- `sonance-ui/e2e/search.spec.ts`
- `sonance-ui/e2e/settings.spec.ts`
- `sonance-ui/e2e/smoke.spec.ts`
- `sonance-ui/e2e/stats.spec.ts`

### sonance-ui/public/
- `sonance-ui/public/manifest.json`
- `sonance-ui/public/sw.js`

### sonance-ui/src/
- `sonance-ui/src/a11y.test.tsx`
- `sonance-ui/src/App.tsx`
- `sonance-ui/src/index.css`
- `sonance-ui/src/main.tsx`
- `sonance-ui/src/test-setup.ts`
- `sonance-ui/src/web-audio-compat.d.ts`

### sonance-ui/src/api/
- `sonance-ui/src/api/activity.ts`
- `sonance-ui/src/api/albums.ts`
- `sonance-ui/src/api/artists.ts`
- `sonance-ui/src/api/auth.ts`
- `sonance-ui/src/api/client.ts`
- `sonance-ui/src/api/favorites.ts`
- `sonance-ui/src/api/health.ts`
- `sonance-ui/src/api/library.ts`
- `sonance-ui/src/api/lyrics.ts`
- `sonance-ui/src/api/playlists.ts`
- `sonance-ui/src/api/plays.ts`
- `sonance-ui/src/api/scrobble.ts`
- `sonance-ui/src/api/search.ts`
- `sonance-ui/src/api/stats.ts`
- `sonance-ui/src/api/tracks.ts`
- `sonance-ui/src/api/waveforms.ts`

### sonance-ui/src/audio/
- `sonance-ui/src/audio/analyzerDeckDataSource.ts`
- `sonance-ui/src/audio/audioGraph.ts`
- `sonance-ui/src/audio/audioPreferences.test.ts`
- `sonance-ui/src/audio/audioPreferences.ts`
- `sonance-ui/src/audio/colorExtraction.test.ts`
- `sonance-ui/src/audio/colorExtraction.ts`
- `sonance-ui/src/audio/eqMath.test.ts`
- `sonance-ui/src/audio/eqMath.ts`
- `sonance-ui/src/audio/eqPresetStorage.test.ts`
- `sonance-ui/src/audio/eqPresetStorage.ts`
- `sonance-ui/src/audio/eqProcessor.ts`
- `sonance-ui/src/audio/eqSpectrumSource.ts`

### sonance-ui/src/components/activity/
- `sonance-ui/src/components/activity/ActivityFeed.tsx`

### sonance-ui/src/components/analyzer/
- `sonance-ui/src/components/analyzer/AnalyzerDeck.css`
- `sonance-ui/src/components/analyzer/AnalyzerDeck.tsx`
- `sonance-ui/src/components/analyzer/DeckSettings.tsx`
- `sonance-ui/src/components/analyzer/index.ts`
- `sonance-ui/src/components/analyzer/ScopeOptionsPopover.tsx`
- `sonance-ui/src/components/analyzer/types.ts`
- `sonance-ui/src/components/analyzer/useDeckStore.ts`

### sonance-ui/src/components/analyzer/scopes/
- `sonance-ui/src/components/analyzer/scopes/ClassicBars.ts`
- `sonance-ui/src/components/analyzer/scopes/heatScale.ts`
- `sonance-ui/src/components/analyzer/scopes/index.ts`
- `sonance-ui/src/components/analyzer/scopes/LUFSMeter.ts`
- `sonance-ui/src/components/analyzer/scopes/Oscilloscope.ts`
- `sonance-ui/src/components/analyzer/scopes/Spectrogram.ts`
- `sonance-ui/src/components/analyzer/scopes/SpectrumAnalyzer.ts`
- `sonance-ui/src/components/analyzer/scopes/Vectorscope.ts`
- `sonance-ui/src/components/analyzer/scopes/VUMeter.ts`
- `sonance-ui/src/components/analyzer/scopes/Waveform.ts`

### sonance-ui/src/components/auth/
- `sonance-ui/src/components/auth/LoginTransition.tsx`
- `sonance-ui/src/components/auth/ProtectedRoute.tsx`

### sonance-ui/src/components/common/
- `sonance-ui/src/components/common/ErrorBoundary.tsx`
- `sonance-ui/src/components/common/ErrorMessage.tsx`
- `sonance-ui/src/components/common/HeartButton.tsx`
- `sonance-ui/src/components/common/OfflineBanner.tsx`
- `sonance-ui/src/components/common/Skeletons.tsx`
- `sonance-ui/src/components/common/Spinner.tsx`
- `sonance-ui/src/components/common/TrackContextMenu.tsx`

### sonance-ui/src/components/home/
- `sonance-ui/src/components/home/Carousel.tsx`

### sonance-ui/src/components/icons/
- `sonance-ui/src/components/icons/GitHubIcon.tsx`

### sonance-ui/src/components/layout/
- `sonance-ui/src/components/layout/AppShell.tsx`
- `sonance-ui/src/components/layout/PaletteSelector.tsx`
- `sonance-ui/src/components/layout/ParticlesBackground.tsx`
- `sonance-ui/src/components/layout/Sidebar.tsx`
- `sonance-ui/src/components/layout/ThemeSelector.tsx`
- `sonance-ui/src/components/layout/TopBar.tsx`

### sonance-ui/src/components/layout/shells/
- `sonance-ui/src/components/layout/shells/EvolvedShell.tsx`
- `sonance-ui/src/components/layout/shells/MinimalShell.tsx`
- `sonance-ui/src/components/layout/shells/NovaShell.tsx`

### sonance-ui/src/components/library/
- `sonance-ui/src/components/library/AlbumCard.tsx`
- `sonance-ui/src/components/library/AlbumInfoCard.tsx`
- `sonance-ui/src/components/library/ArtistCard.tsx`
- `sonance-ui/src/components/library/TrackList.tsx`

### sonance-ui/src/components/player/
- *(27 files: 27 .tsx)*

### sonance-ui/src/components/player/cassette/
- `sonance-ui/src/components/player/cassette/CassetteCanvas.tsx`
- `sonance-ui/src/components/player/cassette/DeckLEDs.tsx`
- `sonance-ui/src/components/player/cassette/DeckThemeToggle.tsx`
- `sonance-ui/src/components/player/cassette/DeckTransport.tsx`
- `sonance-ui/src/components/player/cassette/Odometer.tsx`
- `sonance-ui/src/components/player/cassette/VUMeter.tsx`

### sonance-ui/src/context/
- `sonance-ui/src/context/AuthContext.test.ts`
- `sonance-ui/src/context/AuthContext.tsx`
- `sonance-ui/src/context/LyricsSidebarContext.test.tsx`
- `sonance-ui/src/context/LyricsSidebarContext.tsx`
- `sonance-ui/src/context/PlayerContext.test.ts`
- `sonance-ui/src/context/PlayerContext.tsx`
- `sonance-ui/src/context/QueuePanelContext.test.tsx`
- `sonance-ui/src/context/QueuePanelContext.tsx`

### sonance-ui/src/hooks/
- `sonance-ui/src/hooks/useDynamicTheme.ts`
- `sonance-ui/src/hooks/useFavorites.ts`
- `sonance-ui/src/hooks/useFrameScheduler.ts`
- `sonance-ui/src/hooks/useGapless.ts`
- `sonance-ui/src/hooks/useMarqueePref.ts`
- `sonance-ui/src/hooks/useMediaSession.ts`
- `sonance-ui/src/hooks/useOnlineStatus.ts`
- `sonance-ui/src/hooks/useParticles.ts`
- `sonance-ui/src/hooks/usePlayer.ts`
- `sonance-ui/src/hooks/usePlaylists.ts`
- `sonance-ui/src/hooks/useScrobble.ts`
- `sonance-ui/src/hooks/useWaveform.ts`

### sonance-ui/src/pages/
- `sonance-ui/src/pages/AlbumDetailPage.tsx`
- `sonance-ui/src/pages/AlbumsPage.tsx`
- `sonance-ui/src/pages/ArtistDetailPage.tsx`
- `sonance-ui/src/pages/ArtistsPage.tsx`
- `sonance-ui/src/pages/HomePage.tsx`
- `sonance-ui/src/pages/LibraryHealthPage.tsx`
- `sonance-ui/src/pages/LibraryPage.tsx`
- `sonance-ui/src/pages/LoginPage.tsx`
- `sonance-ui/src/pages/PlaylistDetailPage.tsx`
- `sonance-ui/src/pages/PlaylistsPage.tsx`
- `sonance-ui/src/pages/SearchPage.tsx`
- `sonance-ui/src/pages/SettingsPage.tsx`
- `sonance-ui/src/pages/StatsPage.tsx`
- `sonance-ui/src/pages/TracksPage.tsx`

### sonance-ui/src/themes/
- `sonance-ui/src/themes/index.ts`
- `sonance-ui/src/themes/ThemeProvider.test.tsx`
- `sonance-ui/src/themes/ThemeProvider.tsx`
- `sonance-ui/src/themes/types.ts`
- `sonance-ui/src/themes/useTheme.ts`

### sonance-ui/src/themes/palettes/
- `sonance-ui/src/themes/palettes/amber.ts`
- `sonance-ui/src/themes/palettes/crimson.ts`
- `sonance-ui/src/themes/palettes/cyan.ts`
- `sonance-ui/src/themes/palettes/daylight.ts`
- `sonance-ui/src/themes/palettes/emerald.ts`
- `sonance-ui/src/themes/palettes/frost.ts`
- `sonance-ui/src/themes/palettes/index.ts`
- `sonance-ui/src/themes/palettes/indigo.ts`
- `sonance-ui/src/themes/palettes/sunrise.ts`
- `sonance-ui/src/themes/palettes/zinc.ts`

### sonance-ui/src/themes/tokens/
- `sonance-ui/src/themes/tokens/evolved.ts`
- `sonance-ui/src/themes/tokens/minimal.ts`
- `sonance-ui/src/themes/tokens/nova.ts`

### sonance-ui/src/types/
- `sonance-ui/src/types/index.ts`

### sonance-ui/src/utils/
- `sonance-ui/src/utils/artistAvatar.test.ts`
- `sonance-ui/src/utils/artistAvatar.ts`
- `sonance-ui/src/utils/errors.test.ts`
- `sonance-ui/src/utils/errors.ts`
- `sonance-ui/src/utils/format.test.ts`
- `sonance-ui/src/utils/format.ts`
- `sonance-ui/src/utils/greetings.test.ts`
- `sonance-ui/src/utils/greetings.ts`
- `sonance-ui/src/utils/lrcParser.test.ts`
- `sonance-ui/src/utils/lrcParser.ts`
