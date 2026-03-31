---
estimated_steps: 7
estimated_files: 4
skills_used: []
---

# T01: User scrobble settings + config

1. Add scrobble config fields to User entity: lastfmSessionKey, listenbrainzToken
2. Create ScrobbleSettingsResponse DTO (shows which services are connected)
3. Add PUT /api/users/me/scrobble endpoint for updating scrobble settings
4. Add GET /api/users/me/scrobble endpoint for reading current config (masks tokens)
5. Add Last.fm env vars: LASTFM_API_KEY, LASTFM_API_SECRET in application.yml with defaults
6. Create LastfmConfig properties class
7. Verify: mvn compile

## Inputs

- `User entity`
- `application.yml`

## Expected Output

- `Updated User.java`
- `ScrobbleSettings endpoints`
- `LastfmConfig.java`

## Verification

mvn compile. curl GET /api/users/me/scrobble returns scrobble status.
