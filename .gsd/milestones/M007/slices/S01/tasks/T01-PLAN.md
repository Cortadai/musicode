---
estimated_steps: 6
estimated_files: 3
skills_used: []
---

# T01: PlaybackEvent entity + record play endpoint

1. Create PlaybackEvent entity: id, user (ManyToOne), track (ManyToOne), playedAt (Instant), listenDurationSec (Integer)
2. Create PlaybackEventRepository with JpaRepository
3. Create PlayController with POST /api/plays/{trackId} — accepts optional listenDurationSec in request body
4. Endpoint resolves authenticated user from SecurityContext, creates PlaybackEvent
5. Add OpenAPI annotations
6. Verify: start server, login, POST to /api/plays/1, check H2 console for row

## Inputs

- `Track entity`
- `User entity`
- `SecurityConfig`

## Expected Output

- `PlaybackEvent.java`
- `PlaybackEventRepository.java`
- `PlayController.java`

## Verification

mvn compile succeeds. curl POST /api/plays/{trackId} returns 201 with event data.
