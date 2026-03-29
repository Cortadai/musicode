---
estimated_steps: 7
estimated_files: 10
skills_used: []
---

# T01: Scaffold Spring Boot project with JPA entities and H2

Create the musicode-server Maven project with Spring Boot 3 + Java 21. Define JPA entities (Track, Album, Artist, LibraryFolder) and Spring Data repositories. Configure H2 in file mode with auto-DDL.

Steps:
1. Generate Spring Boot project (spring-boot-starter-web, data-jpa, h2, devtools, validation, lombok)
2. Create entity classes with JPA annotations and relationships
3. Create Spring Data JPA repositories
4. Configure application.yml: H2 file mode, show-sql, ddl-auto=update
5. Verify app starts and tables are created

## Inputs

- `PLAN.md`

## Expected Output

- `musicode-server/pom.xml`
- `musicode-server/src/main/java/com/musicode/model/entity/Track.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Album.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Artist.java`
- `musicode-server/src/main/java/com/musicode/model/entity/LibraryFolder.java`
- `musicode-server/src/main/resources/application.yml`

## Verification

cd musicode-server && mvn spring-boot:run — app starts on :8080, H2 console shows TRACK, ALBUM, ARTIST, LIBRARY_FOLDER tables
