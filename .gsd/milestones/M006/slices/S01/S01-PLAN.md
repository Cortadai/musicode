# S01: SpringDoc OpenAPI + Swagger UI

**Goal:** Add SpringDoc OpenAPI dependency, configure for cookie-based auth, annotate controllers with descriptions, verify Swagger UI works behind Spring Security.
**Demo:** After this: After this: /swagger-ui.html shows all Musicode REST endpoints grouped by controller, with request/response schemas and try-it-out. /v3/api-docs returns the OpenAPI 3.0 JSON spec.

## Tasks
- [x] **T01: Add SpringDoc dependency + Security config** — 1. Add springdoc-openapi-starter-webmvc-ui dependency to pom.xml
2. Configure SecurityConfig to permit /swagger-ui/**, /v3/api-docs/**, /swagger-ui.html
3. Add OpenAPI configuration bean with app title, version, description
4. Configure cookie-based auth scheme in OpenAPI config so try-it-out sends cookies
5. Verify Spring Boot starts with springdoc on classpath
6. Verify /swagger-ui.html is accessible
  - Estimate: 30min
  - Files: musicode-server/pom.xml, musicode-server/src/main/java/com/musicode/config/SecurityConfig.java, musicode-server/src/main/java/com/musicode/config/OpenApiConfig.java
  - Verify: mvn spring-boot:run, then curl -s http://localhost:8080/swagger-ui.html returns 200 or redirect. curl -s http://localhost:8080/v3/api-docs returns JSON.
- [x] **T02: Annotate controllers with OpenAPI descriptions** — 1. Add @Tag annotations to each controller with name and description
2. Add @Operation annotations to key endpoints with summary and description
3. Add @ApiResponse annotations for error codes (400, 401, 404, 409, 500)
4. Ensure DTOs (Records) are properly documented via @Schema where needed
5. Verify Swagger UI shows descriptions and schemas for all endpoints
  - Estimate: 40min
  - Files: musicode-server/src/main/java/com/musicode/controller/AuthController.java, musicode-server/src/main/java/com/musicode/controller/UserController.java, musicode-server/src/main/java/com/musicode/controller/AlbumController.java, musicode-server/src/main/java/com/musicode/controller/ArtistController.java, musicode-server/src/main/java/com/musicode/controller/TrackController.java, musicode-server/src/main/java/com/musicode/controller/SearchController.java, musicode-server/src/main/java/com/musicode/controller/LibraryController.java, musicode-server/src/main/java/com/musicode/controller/CoverArtController.java
  - Verify: Start server, open /swagger-ui.html in browser, verify all controllers and endpoints visible with descriptions. mvn clean verify passes.
- [x] **T03: Verify integration + run all tests** — 1. Start Spring Boot and verify /swagger-ui.html loads
2. Verify /v3/api-docs returns valid OpenAPI 3.0 JSON with all paths
3. Verify try-it-out works for an authenticated endpoint (login first, then call /api/users)
4. Run mvn clean verify — all 98+ tests pass, coverage ≥80%
5. Commit
  - Estimate: 15min
  - Verify: mvn clean verify exits 0. /swagger-ui.html shows all endpoints. /v3/api-docs returns valid JSON.
