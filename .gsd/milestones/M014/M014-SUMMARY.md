---
id: M014
title: "Library Health Dashboard"
status: complete
completed_at: 2026-04-25T17:08:28.474Z
key_decisions:
  - Used Album.hasCoverArt flag from DB instead of filesystem checks for cover art health
  - Server-side pagination for all issue queries to handle large libraries
  - 8 health check types covering the most common metadata issues
key_files:
  - musicode-server/src/main/java/com/musicode/service/LibraryHealthService.java
  - musicode-server/src/main/java/com/musicode/controller/LibraryHealthController.java
  - musicode-ui/src/pages/LibraryHealthPage.tsx
lessons_learned:
  - JPQL queries with Pageable work well for complex health checks without needing native SQL
---

# M014: Library Health Dashboard

**Full-stack library health analysis with 8 metadata checks, paginated REST API, and interactive dashboard UI**

## What Happened

M014 delivered a complete library health analysis feature. The backend (LibraryHealthService) runs 8 checks against the music library: missing title, artist, album, track number, year, genre, albums without cover art, and albums with inconsistent artists. Results are exposed via two REST endpoints with server-side pagination. The frontend provides an interactive dashboard at /library/health with color-coded summary cards and a filterable issues table. A guidance banner directs users to MusicBrainz Picard for fixing metadata issues externally.

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

None.

## Follow-ups

None.
