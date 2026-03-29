---
id: T02
parent: S01
milestone: M001
provides: []
requires: []
affects: []
key_files: ["musicode-server/src/main/java/com/musicode/service/MetadataService.java", "musicode-server/src/main/java/com/musicode/model/dto/TrackMetadata.java", "musicode-server/src/test/java/com/musicode/service/MetadataServiceTest.java"]
key_decisions: ["Used net.jthink:jaudiotagger:2.2.5 — the latest version available on Maven Central", "Filename used as fallback title when tag is missing/empty"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "3 unit tests pass: reads real FLAC metadata correctly, returns null for nonexistent file, handles missing title with filename fallback."
completed_at: 2026-03-29T19:07:55.382Z
blocker_discovered: false
---

# T02: MetadataService reads FLAC metadata (title, artist, album, duration, cover art) using JAudioTagger 2.2.5.

> MetadataService reads FLAC metadata (title, artist, album, duration, cover art) using JAudioTagger 2.2.5.

## What Happened
---
id: T02
parent: S01
milestone: M001
key_files:
  - musicode-server/src/main/java/com/musicode/service/MetadataService.java
  - musicode-server/src/main/java/com/musicode/model/dto/TrackMetadata.java
  - musicode-server/src/test/java/com/musicode/service/MetadataServiceTest.java
key_decisions:
  - Used net.jthink:jaudiotagger:2.2.5 — the latest version available on Maven Central
  - Filename used as fallback title when tag is missing/empty
duration: ""
verification_result: passed
completed_at: 2026-03-29T19:07:55.382Z
blocker_discovered: false
---

# T02: MetadataService reads FLAC metadata (title, artist, album, duration, cover art) using JAudioTagger 2.2.5.

**MetadataService reads FLAC metadata (title, artist, album, duration, cover art) using JAudioTagger 2.2.5.**

## What Happened

Added JAudioTagger 2.2.5 to pom.xml. Created TrackMetadata DTO with all audio fields plus cover art bytes and MIME type. Implemented MetadataService.readMetadata(Path) that reads FLAC tags via JAudioTagger, handles edge cases (missing tags, missing cover art, corrupted files, track number formats like "3/17"), and falls back to filename as title. Tested against a real FLAC file (Echo Synth — After The Neon Fades) — all metadata fields read correctly including 101KB embedded JPEG cover art.

## Verification

3 unit tests pass: reads real FLAC metadata correctly, returns null for nonexistent file, handles missing title with filename fallback.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn test -Dtest=MetadataServiceTest` | 0 | ✅ pass — 3 tests, 0 failures | 6900ms |


## Deviations

Used JAudioTagger 2.2.5 (net.jthink groupId) instead of 3.x as originally planned — 3.x does not exist on Maven Central. 2.2.5 is the latest official release and works perfectly.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/MetadataService.java`
- `musicode-server/src/main/java/com/musicode/model/dto/TrackMetadata.java`
- `musicode-server/src/test/java/com/musicode/service/MetadataServiceTest.java`


## Deviations
Used JAudioTagger 2.2.5 (net.jthink groupId) instead of 3.x as originally planned — 3.x does not exist on Maven Central. 2.2.5 is the latest official release and works perfectly.

## Known Issues
None.
