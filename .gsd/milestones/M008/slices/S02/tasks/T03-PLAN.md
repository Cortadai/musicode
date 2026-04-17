---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Play→Scrobble integration test — verify scrobble invocation

@SpringBootTest integration test. Create user + track in DB, POST /api/plays/{trackId} with auth. Verify ScrobbleService.scrobble() was called with correct PlaybackEvent (matching user, track, timestamp). Use @MockBean ScrobbleService as the boundary — we already proved the wire works in S01. Also verify ActivityService.broadcast() was called.

## Inputs

- `PlayController.java — POST /{trackId}, calls scrobbleService.scrobble(event)`
- `PlaybackEvent entity — builder pattern, user+track+listenDurationSec`
- `Existing PlayControllerTest.java for setup patterns (user, track, repo cleanup)`

## Expected Output

- `PlayScrobbleIntegrationTest.java verifying scrobble() called with correct event data after play recording`

## Verification

mvn test -pl musicode-server -Dtest=PlayScrobbleIntegrationTest — all green
