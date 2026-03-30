---
id: T02
parent: S02
milestone: M001
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/controller/CoverArtController.java"]
key_decisions: ["Cache-Control max-age 7 days for cover art (covers don't change between scans)"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "GET /api/covers/1 returns 200 image/jpeg (101KB) with Cache-Control: max-age=604800. GET /api/covers/999 returns 404."
completed_at: 2026-03-30T09:06:35.853Z
blocker_discovered: false
---

# T02: Cover art endpoint serves album JPGs with 7-day cache control.

> Cover art endpoint serves album JPGs with 7-day cache control.

## What Happened
---
id: T02
parent: S02
milestone: M001
key_files:
  - musicode-server/src/main/java/com/musicode/controller/CoverArtController.java
key_decisions:
  - Cache-Control max-age 7 days for cover art (covers don't change between scans)
duration: ""
verification_result: passed
completed_at: 2026-03-30T09:06:35.853Z
blocker_discovered: false
---

# T02: Cover art endpoint serves album JPGs with 7-day cache control.

**Cover art endpoint serves album JPGs with 7-day cache control.**

## What Happened

Created CoverArtController with GET /api/covers/{albumId}. Uses CoverArtService to locate the JPG file on disk, returns it as image/jpeg with Cache-Control max-age=7 days. Returns 404 if no cover art exists for the album.

## Verification

GET /api/covers/1 returns 200 image/jpeg (101KB) with Cache-Control: max-age=604800. GET /api/covers/999 returns 404.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `curl -o /dev/null -w '%{http_code} %{content_type}' http://localhost:8080/api/covers/1` | 0 | ✅ pass — 200 image/jpeg 101KB | 100ms |
| 2 | `curl -o /dev/null -w '%{http_code}' http://localhost:8080/api/covers/999` | 0 | ✅ pass — 404 | 50ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/controller/CoverArtController.java`


## Deviations
None.

## Known Issues
None.
