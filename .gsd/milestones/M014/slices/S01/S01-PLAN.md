# S01: Backend: Health Service + API endpoints

**Goal:** LibraryHealthService con todos los health checks, endpoints REST paginados, tests de integración
**Demo:** curl a /api/library/health/summary y /issues devuelve datos correctos

## Must-Haves

- Todos los health checks implementados, endpoints devuelven JSON correcto con paginación, tests pasan

## Proof Level

- This slice proves: integration-tests + manual curl

## Integration Closure

Endpoints listos para consumir desde frontend

## Verification

- Logs de health check execution time

## Tasks

- [ ] **T01: Health check DTOs y LibraryHealthService** `est:2h`
  Crear DTOs (HealthSummary, HealthIssue, IssueType enum) y LibraryHealthService con todos los checks: track sin título útil, sin artista, sin álbum, sin track number, sin año, sin género, álbum sin cover art (usar hasCoverArt flag), álbum con artistas inconsistentes entre sus tracks. Cada check es un método que devuelve conteo y lista paginada.
  - Files: `musicode-server/src/main/java/com/musicode/model/dto/HealthSummary.java`, `musicode-server/src/main/java/com/musicode/model/dto/HealthIssue.java`, `musicode-server/src/main/java/com/musicode/model/dto/IssueType.java`, `musicode-server/src/main/java/com/musicode/service/LibraryHealthService.java`, `musicode-server/src/main/java/com/musicode/repository/TrackRepository.java`, `musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java`
  - Verify: Unit tests para cada check con datos que cubren caso positivo y negativo

- [ ] **T02: Repository queries custom para health checks** `est:1h`
  Añadir queries JPQL/native a TrackRepository y AlbumRepository para los checks que no se resuelven con métodos derivados: tracks con título igual al nombre del archivo, álbumes sin cover, álbumes con artistas mixtos entre tracks. Queries paginadas con Pageable.
  - Files: `musicode-server/src/main/java/com/musicode/repository/TrackRepository.java`, `musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java`
  - Verify: Integration tests con H2 que insertan datos de prueba y validan resultados de cada query

- [ ] **T03: REST endpoints y controller** `est:45min`
  Crear LibraryHealthController con GET /api/library/health/summary (devuelve HealthSummary) y GET /api/library/health/issues?type=X&page=0&size=20 (devuelve Page<HealthIssue>). Protegido con autenticación.
  - Files: `musicode-server/src/main/java/com/musicode/controller/LibraryHealthController.java`
  - Verify: Integration test con MockMvc que valida respuestas JSON y paginación

- [ ] **T04: Tests de integración completos** `est:1h`
  Tests @SpringBootTest que insertan una librería de prueba con issues conocidos (tracks sin artista, álbumes sin cover, etc.) y validan que summary devuelve conteos correctos y issues devuelve los registros esperados. Cubrir edge cases: librería vacía, librería sin issues.
  - Files: `musicode-server/src/test/java/com/musicode/service/LibraryHealthServiceTest.java`, `musicode-server/src/test/java/com/musicode/controller/LibraryHealthControllerTest.java`
  - Verify: mvn test -pl musicode-server pasa sin fallos

## Files Likely Touched

- musicode-server/src/main/java/com/musicode/model/dto/HealthSummary.java
- musicode-server/src/main/java/com/musicode/model/dto/HealthIssue.java
- musicode-server/src/main/java/com/musicode/model/dto/IssueType.java
- musicode-server/src/main/java/com/musicode/service/LibraryHealthService.java
- musicode-server/src/main/java/com/musicode/repository/TrackRepository.java
- musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java
- musicode-server/src/main/java/com/musicode/controller/LibraryHealthController.java
- musicode-server/src/test/java/com/musicode/service/LibraryHealthServiceTest.java
- musicode-server/src/test/java/com/musicode/controller/LibraryHealthControllerTest.java
