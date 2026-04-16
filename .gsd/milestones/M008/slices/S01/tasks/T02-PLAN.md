---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: LastfmService unit tests (signature + HTTP)

Unit test LastfmService. Focus: API signature generation (MD5 of sorted params + secret), scrobble payload building, error mapping. Mock RestTemplate / HttpClient. Verify signature determinism against a known-good fixture.

## Inputs

- `musicode-server/src/main/java/com/musicode/service/LastfmService.java`
- `musicode-server/src/main/java/com/musicode/config/LastfmConfig.java`

## Expected Output

- `LastfmServiceTest.java covering signature generation, scrobble success, scrobble failure, token exchange. ≥80% line coverage.`

## Verification

cd musicode-server && mvn -q -Dtest=LastfmServiceTest test
