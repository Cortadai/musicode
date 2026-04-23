# S05: Error handling servicios externos + cleanup

**Goal:** Clasificar errores de servicios externos (timeout vs auth vs config) con logging diferenciado, retry inteligente (no reintentar auth failures), y cancelación de requests en unmount en el frontend.
**Demo:** Logs distinguen timeout vs auth failure vs config error en Last.fm y ListenBrainz. Frontend cancela requests en unmount.

## Must-Haves

- 1. Logs backend distinguen timeout, auth failure, config error y network error para Last.fm y ListenBrainz. 2. ScrobbleService no reintenta errores de autenticación. 3. Frontend cancela requests pendientes en unmount via AbortController. 4. Tests unitarios cubren cada tipo de error.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Typed error classification in LastfmService and ListenBrainzService** `est:25min`
  Replace generic catch(Exception) with typed exception handling: HttpClientErrorException for 4xx (auth), HttpServerErrorException for 5xx, ResourceAccessException for timeout/network. Log each with distinct markers (LASTFM_AUTH_ERROR, LASTFM_TIMEOUT, etc). Create ScrobbleErrorType enum for classification.
  - Files: `musicode-server/src/main/java/com/musicode/service/LastfmService.java`, `musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java`, `musicode-server/src/main/java/com/musicode/model/dto/ScrobbleResult.java`
  - Verify: mvn test -pl musicode-server passes. Grep logs for typed error markers in existing tests.

- [x] **T02: Smart retry in ScrobbleService — skip auth errors** `est:15min`
  Update ScrobbleService retry loop to inspect ScrobbleResult.errorType. Retry on TIMEOUT and SERVER_ERROR. Do NOT retry on AUTH_ERROR or CONFIG_ERROR — log once and bail. Preserve existing exponential backoff for retryable errors.
  - Files: `musicode-server/src/main/java/com/musicode/service/ScrobbleService.java`
  - Verify: ScrobbleServiceTest updated with cases: auth error → no retry, timeout → retry with backoff. mvn test passes.

- [x] **T03: Frontend AbortController on unmount** `est:20min`
  Add AbortController to the axios client.ts interceptor. Each request gets a signal. Create a useAbortOnUnmount hook or integrate with React Query's signal. Verify components that use manual fetch (non-React-Query) cancel on unmount. Key targets: PlayerContext play reporting, any manual API calls outside React Query.
  - Files: `musicode-ui/src/api/client.ts`, `musicode-ui/src/context/PlayerContext.tsx`, `musicode-ui/src/hooks/useApi.ts`
  - Verify: React Query already handles abort. Manual fetch calls use AbortController. No console warnings about state updates on unmounted components. npm run build succeeds.

- [x] **T04: WireMock tests for error classification** `est:20min`
  Extend LastfmServiceWireMockTest and ListenBrainzServiceWireMockTest with scenarios: 401 → AUTH_ERROR, 500 → SERVER_ERROR, connection timeout → TIMEOUT, missing config → CONFIG_ERROR. Verify ScrobbleResult carries correct errorType.
  - Files: `musicode-server/src/test/java/com/musicode/service/LastfmServiceWireMockTest.java`, `musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceWireMockTest.java`
  - Verify: mvn test -pl musicode-server — all new WireMock scenarios pass. Each error type tested.

## Files Likely Touched

- musicode-server/src/main/java/com/musicode/service/LastfmService.java
- musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java
- musicode-server/src/main/java/com/musicode/model/dto/ScrobbleResult.java
- musicode-server/src/main/java/com/musicode/service/ScrobbleService.java
- musicode-ui/src/api/client.ts
- musicode-ui/src/context/PlayerContext.tsx
- musicode-ui/src/hooks/useApi.ts
- musicode-server/src/test/java/com/musicode/service/LastfmServiceWireMockTest.java
- musicode-server/src/test/java/com/musicode/service/ListenBrainzServiceWireMockTest.java
