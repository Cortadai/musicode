---
estimated_steps: 10
estimated_files: 2
skills_used: []
---

# T02: ListenBrainz + Last.fm service implementations

1. Create ListenBrainzService with submitListen(track, token) method
2. POST to https://api.listenbrainz.org/1/submit-listens
3. Payload: {listen_type: 'single', payload: [{listened_at, track_metadata: {artist_name, track_name, release_name}}]}
4. Header: Authorization: Token {user_token}
5. Create LastfmService with scrobble(track, sessionKey) method
6. POST to https://ws.audioscrobbler.com/2.0/ with method=track.scrobble
7. Params: artist, track, album, timestamp, api_key, sk (session key)
8. Generate API signature: md5 of sorted params + api_secret
9. Add Last.fm auth.getMobileSession for initial auth (username+password → session key)
10. Verify: unit test with mocked HTTP

## Inputs

- `Last.fm API docs`
- `ListenBrainz API docs`

## Expected Output

- `ListenBrainzService.java`
- `LastfmService.java`

## Verification

mvn compile. Services instantiate correctly.
