---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: Flyway migration + Track entity fields + LyricsStatus enum

Add V2 Flyway migration with syncedLyrics (TEXT), plainLyrics (TEXT), lyricsStatus (VARCHAR) columns to track table. Create LyricsStatus enum (NOT_SEARCHED, SYNCED, PLAIN_ONLY, INSTRUMENTAL, NOT_FOUND). Update Track entity with new fields and @Enumerated annotation.

## Inputs

- `Existing Track entity`
- `Existing Flyway migrations`

## Expected Output

- `V2 migration SQL file`
- `LyricsStatus enum`
- `Updated Track entity`

## Verification

Spring Boot starts cleanly with migration applied, Track entity compiles with new fields
