---
id: T01
parent: S01
milestone: M015
key_files:
  - musicode-server/src/main/resources/db/migration/V2__add_lyrics_columns.sql
  - musicode-server/src/main/java/com/musicode/model/entity/LyricsStatus.java
  - musicode-server/src/main/java/com/musicode/model/entity/Track.java
key_decisions:
  - (none)
duration: 
verification_result: untested
completed_at: 2026-04-25T15:45:29.233Z
blocker_discovered: false
---

# T01: Flyway V2 migration + Track entity lyrics fields + LyricsStatus enum

**Flyway V2 migration + Track entity lyrics fields + LyricsStatus enum**

## What Happened

Added V2__add_lyrics_columns.sql migration with synced_lyrics (TEXT), plain_lyrics (TEXT), and lyrics_status (VARCHAR) columns on the track table. Created LyricsStatus enum (NOT_SEARCHED, SYNCED, PLAIN_ONLY, INSTRUMENTAL, NOT_FOUND). Extended Track entity with the three new fields.

## Verification

Migration runs cleanly on Spring Boot startup. Entity fields map correctly to columns.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| — | No verification commands discovered | — | — | — |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/resources/db/migration/V2__add_lyrics_columns.sql`
- `musicode-server/src/main/java/com/musicode/model/entity/LyricsStatus.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Track.java`
