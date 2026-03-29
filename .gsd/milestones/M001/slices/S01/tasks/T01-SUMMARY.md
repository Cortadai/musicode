---
id: T01
parent: S01
milestone: M001
provides: []
requires: []
affects: []
key_files: ["musicode-server/pom.xml", "musicode-server/src/main/java/com/musicode/model/entity/Track.java", "musicode-server/src/main/java/com/musicode/model/entity/Album.java", "musicode-server/src/main/java/com/musicode/model/entity/Artist.java", "musicode-server/src/main/java/com/musicode/model/entity/LibraryFolder.java", "musicode-server/src/main/resources/application.yml"]
key_decisions: ["Map 'year' field to 'release_year' column to avoid H2 reserved word conflict"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "App starts on port 8080. H2 console accessible at /h2-console (200 OK). Direct H2 Shell query confirms all 4 tables created: ALBUMS, ARTISTS, LIBRARY_FOLDERS, TRACKS."
completed_at: 2026-03-29T18:48:32.747Z
blocker_discovered: false
---

# T01: Scaffolded Spring Boot 3 + Java 21 project with 4 JPA entities, repositories, and H2 file-mode database.

> Scaffolded Spring Boot 3 + Java 21 project with 4 JPA entities, repositories, and H2 file-mode database.

## What Happened
---
id: T01
parent: S01
milestone: M001
key_files:
  - musicode-server/pom.xml
  - musicode-server/src/main/java/com/musicode/model/entity/Track.java
  - musicode-server/src/main/java/com/musicode/model/entity/Album.java
  - musicode-server/src/main/java/com/musicode/model/entity/Artist.java
  - musicode-server/src/main/java/com/musicode/model/entity/LibraryFolder.java
  - musicode-server/src/main/resources/application.yml
key_decisions:
  - Map 'year' field to 'release_year' column to avoid H2 reserved word conflict
duration: ""
verification_result: passed
completed_at: 2026-03-29T18:48:32.748Z
blocker_discovered: false
---

# T01: Scaffolded Spring Boot 3 + Java 21 project with 4 JPA entities, repositories, and H2 file-mode database.

**Scaffolded Spring Boot 3 + Java 21 project with 4 JPA entities, repositories, and H2 file-mode database.**

## What Happened

Created the musicode-server Maven project with Spring Boot 3.4.4, Java 21, and all required dependencies (web, data-jpa, h2, validation, lombok, devtools). Defined 4 JPA entities: Artist (name, unique), Album (title + artist_id unique constraint, year, coverArtPath), Track (title, trackNumber, discNumber, duration, filePath unique, bitRate, sampleRate, bitsPerSample, genre, year), and LibraryFolder (path unique, lastScannedAt, trackCount). Created Spring Data repositories with custom query methods (findByNameIgnoreCase, findByTitleIgnoreCaseAndArtistId, findByFilePath, existsByFilePath). H2 configured in file mode at ./data/musicode-db. Hit one issue: 'year' is a reserved word in H2 causing SQL syntax errors on table creation. Fixed by mapping to 'release_year' column name in both Album and Track entities.

## Verification

App starts on port 8080. H2 console accessible at /h2-console (200 OK). Direct H2 Shell query confirms all 4 tables created: ALBUMS, ARTISTS, LIBRARY_FOLDERS, TRACKS.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn compile -q` | 0 | ✅ pass | 8700ms |
| 2 | `mvn spring-boot:run (startup)` | 0 | ✅ pass — app started on :8080 | 6000ms |
| 3 | `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/h2-console/` | 0 | ✅ pass — 200 OK | 200ms |
| 4 | `java -cp h2.jar org.h2.tools.Shell -sql 'SHOW TABLES'` | 0 | ✅ pass — 4 tables: ALBUMS, ARTISTS, LIBRARY_FOLDERS, TRACKS | 500ms |


## Deviations

Campo 'year' es palabra reservada en H2 — mapeado a columna 'release_year' en Album y Track con @Column(name = "release_year").

## Known Issues

None.

## Files Created/Modified

- `musicode-server/pom.xml`
- `musicode-server/src/main/java/com/musicode/model/entity/Track.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Album.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Artist.java`
- `musicode-server/src/main/java/com/musicode/model/entity/LibraryFolder.java`
- `musicode-server/src/main/resources/application.yml`


## Deviations
Campo 'year' es palabra reservada en H2 — mapeado a columna 'release_year' en Album y Track con @Column(name = "release_year").

## Known Issues
None.
