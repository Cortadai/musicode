---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: LyricsController + endpoint tests

Create LyricsController with GET /api/lyrics/{trackId} that returns cached lyrics or triggers lazy fetch. Add POST /api/lyrics/{trackId}/retry to reset NOT_FOUND and re-fetch. Return LyricsResponse DTO with status, syncedLyrics, plainLyrics fields.

## Inputs

- `LyricsService`
- `LyricsResponse DTO`
- `SecurityConfig patterns`

## Expected Output

- `LyricsController`
- `Integration tests`
- `SecurityConfig update`

## Verification

Integration tests: authenticated GET returns lyrics, retry resets cache, 404 for unknown track. SecurityConfig permits /api/lyrics/** for authenticated users.
