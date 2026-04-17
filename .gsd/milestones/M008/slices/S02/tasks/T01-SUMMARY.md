---
id: T01
parent: S02
milestone: M008
key_files:
  - musicode-server/src/test/java/com/musicode/controller/ScrobbleControllerTest.java
key_decisions:
  - Used @MockBean LastfmService instead of full wire — authenticate() hits external API, wire already proved in S01
  - Used exact masked value assertions (is()) instead of startsWith/endsWith to avoid Hamcrest/Mockito ambiguity
duration: 
verification_result: passed
completed_at: 2026-04-17T15:57:47.029Z
blocker_discovered: false
---

# T01: ScrobbleControllerTest — 13 MockMvc tests covering all 4 endpoints (GET/PUT/DELETE×2) with happy + error paths

**ScrobbleControllerTest — 13 MockMvc tests covering all 4 endpoints (GET/PUT/DELETE×2) with happy + error paths**

## What Happened

Created ScrobbleControllerTest with @SpringBootTest + @AutoConfigureMockMvc pattern. Used @MockBean for LastfmService since the controller calls lastfmService.authenticate() which hits an external API. Organized tests in @Nested classes per endpoint group: GetSettings (3 tests), UpdateSettings (6 tests), DisconnectLastfm (2 tests), DisconnectListenBrainz (2 tests). Covers: token masking in GET response, LB connect/disconnect via PUT, LF authenticate success/failure, DELETE idempotency, 401 for unauthenticated requests. Hit two compilation issues: wrong @MockBean import package (Spring Boot 3.4 uses org.springframework.boot.test.mock.mockito.MockBean) and Hamcrest/Mockito ambiguity on startsWith/endsWith — resolved by using exact value assertions instead.

## Verification

mvn test -Dtest=ScrobbleControllerTest — 13 tests, 0 failures

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn test -Dtest=ScrobbleControllerTest` | 0 | pass | 14000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/controller/ScrobbleControllerTest.java`
