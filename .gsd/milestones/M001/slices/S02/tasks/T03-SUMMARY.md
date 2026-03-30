---
id: T03
parent: S02
milestone: M001
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/controller/SearchController.java", "musicode-server/src/main/java/com/musicode/model/dto/SearchResults.java"]
key_decisions: ["Search queries all three entity types (tracks, albums, artists) in parallel with LIKE queries", "Empty query returns empty arrays rather than error"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Search 'dark' returns 24 matches (tracks with Dark in title). Search 'echo' finds Echo Synth artist. Empty query returns empty arrays. Non-matching query returns empty arrays."
completed_at: 2026-03-30T09:06:46.167Z
blocker_discovered: false
---

# T03: Global search endpoint queries tracks, albums, and artists by title/name with LIKE.

> Global search endpoint queries tracks, albums, and artists by title/name with LIKE.

## What Happened
---
id: T03
parent: S02
milestone: M001
key_files:
  - musicode-server/src/main/java/com/musicode/controller/SearchController.java
  - musicode-server/src/main/java/com/musicode/model/dto/SearchResults.java
key_decisions:
  - Search queries all three entity types (tracks, albums, artists) in parallel with LIKE queries
  - Empty query returns empty arrays rather than error
duration: ""
verification_result: passed
completed_at: 2026-03-30T09:06:46.167Z
blocker_discovered: false
---

# T03: Global search endpoint queries tracks, albums, and artists by title/name with LIKE.

**Global search endpoint queries tracks, albums, and artists by title/name with LIKE.**

## What Happened

Created SearchController with GET /api/search?q= that queries tracks (by title), albums (by title), and artists (by name) using case-insensitive LIKE. Returns structured SearchResults DTO with three arrays. Empty or blank queries return empty arrays.

## Verification

Search 'dark' returns 24 matches (tracks with Dark in title). Search 'echo' finds Echo Synth artist. Empty query returns empty arrays. Non-matching query returns empty arrays.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `curl 'http://localhost:8080/api/search?q=dark'` | 0 | ✅ pass — 24 matches | 100ms |
| 2 | `curl 'http://localhost:8080/api/search?q=echo'` | 0 | ✅ pass — 1 artist | 50ms |
| 3 | `curl 'http://localhost:8080/api/search?q='` | 0 | ✅ pass — empty arrays | 50ms |
| 4 | `curl 'http://localhost:8080/api/search?q=zzzzz'` | 0 | ✅ pass — empty arrays | 50ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/controller/SearchController.java`
- `musicode-server/src/main/java/com/musicode/model/dto/SearchResults.java`


## Deviations
None.

## Known Issues
None.
