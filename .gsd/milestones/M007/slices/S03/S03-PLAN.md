# S03: Scrobbling — Last.fm & ListenBrainz

**Goal:** Integrate with Last.fm and ListenBrainz scrobbling APIs. Configurable per-user.
**Demo:** After this: After this: configure Last.fm in settings, play a track, check Last.fm profile → track appears in recent listens.

## Tasks
- [x] **T01: User scrobble settings + config** — 1. Add scrobble config fields to User entity: lastfmSessionKey, listenbrainzToken
2. Create ScrobbleSettingsResponse DTO (shows which services are connected)
3. Add PUT /api/users/me/scrobble endpoint for updating scrobble settings
4. Add GET /api/users/me/scrobble endpoint for reading current config (masks tokens)
5. Add Last.fm env vars: LASTFM_API_KEY, LASTFM_API_SECRET in application.yml with defaults
6. Create LastfmConfig properties class
7. Verify: mvn compile
  - Estimate: 25min
  - Files: musicode-server/src/main/java/com/musicode/model/entity/User.java, musicode-server/src/main/java/com/musicode/controller/UserController.java, musicode-server/src/main/java/com/musicode/config/LastfmConfig.java, musicode-server/src/main/resources/application.yml
  - Verify: mvn compile. curl GET /api/users/me/scrobble returns scrobble status.
- [x] **T02: ListenBrainz + Last.fm service implementations** — 1. Create ListenBrainzService with submitListen(track, token) method
2. POST to https://api.listenbrainz.org/1/submit-listens
3. Payload: {listen_type: 'single', payload: [{listened_at, track_metadata: {artist_name, track_name, release_name}}]}
4. Header: Authorization: Token {user_token}
5. Create LastfmService with scrobble(track, sessionKey) method
6. POST to https://ws.audioscrobbler.com/2.0/ with method=track.scrobble
7. Params: artist, track, album, timestamp, api_key, sk (session key)
8. Generate API signature: md5 of sorted params + api_secret
9. Add Last.fm auth.getMobileSession for initial auth (username+password → session key)
10. Verify: unit test with mocked HTTP
  - Estimate: 45min
  - Files: musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java, musicode-server/src/main/java/com/musicode/service/LastfmService.java
  - Verify: mvn compile. Services instantiate correctly.
- [x] **T03: ScrobbleService orchestration + PlayController hook** — 1. Create ScrobbleService that orchestrates both services
2. @Async method scrobble(PlaybackEvent) — never blocks caller
3. Check user's config: if listenbrainzToken set → call ListenBrainzService
4. If lastfmSessionKey set → call LastfmService
5. Retry with exponential backoff: 1s, 2s, 4s (max 3 retries)
6. Log success/failure with track info, never throw
7. Hook into PlayController: after saving PlaybackEvent, call scrobbleService.scrobble(event)
8. Verify: enable async, configure a test token, play a track
  - Estimate: 30min
  - Files: musicode-server/src/main/java/com/musicode/service/ScrobbleService.java, musicode-server/src/main/java/com/musicode/controller/PlayController.java
  - Verify: mvn compile. Play a track → scrobble log entry appears.
- [x] **T04: Settings UI + tests + verification** — 1. Add scrobble section to frontend Settings page (or create a new ScrobbleSettings component)
2. ListenBrainz: text input for token, save/clear buttons
3. Last.fm: username + password fields for initial auth, connected/disconnected status
4. Call PUT /api/users/me/scrobble to save config
5. Show connection status (connected/disconnected)
6. Run full test suite: mvn clean verify, npm test:coverage, npx playwright test
7. Commit
  - Estimate: 30min
  - Files: musicode-ui/src/pages/SettingsPage.tsx, musicode-ui/src/api/auth.ts
  - Verify: mvn clean verify passes. npx playwright test passes. Settings page shows scrobble config.
