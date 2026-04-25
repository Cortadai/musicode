---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: LyricsService — LRCLIB client + caching logic

Create LyricsService that calls LRCLIB.net GET /api/get with trackName, artistName, albumName, duration params. Parse response: synced lyrics, plain lyrics, instrumental flag. Cache result in Track entity via TrackRepository. Handle NOT_FOUND caching. Add retry support (reset NOT_FOUND status). Use @Value for API base URL for testability.

## Inputs

- `Track entity with lyrics fields`
- `LRCLIB API docs: GET /api/get?track_name=X&artist_name=Y&album_name=Z&duration=D`

## Expected Output

- `LyricsService with fetch + cache logic`
- `LyricsResponse DTO`
- `Unit tests + WireMock tests`

## Verification

Unit tests pass for all response types (synced, plain, instrumental, not found, API error). WireMock contract test validates actual HTTP call to LRCLIB.
