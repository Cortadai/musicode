---
estimated_steps: 8
estimated_files: 2
skills_used: []
---

# T03: ScrobbleService orchestration + PlayController hook

1. Create ScrobbleService that orchestrates both services
2. @Async method scrobble(PlaybackEvent) — never blocks caller
3. Check user's config: if listenbrainzToken set → call ListenBrainzService
4. If lastfmSessionKey set → call LastfmService
5. Retry with exponential backoff: 1s, 2s, 4s (max 3 retries)
6. Log success/failure with track info, never throw
7. Hook into PlayController: after saving PlaybackEvent, call scrobbleService.scrobble(event)
8. Verify: enable async, configure a test token, play a track

## Inputs

- `ListenBrainzService`
- `LastfmService`
- `PlaybackEvent entity`

## Expected Output

- `ScrobbleService.java`
- `Updated PlayController.java`

## Verification

mvn compile. Play a track → scrobble log entry appears.
