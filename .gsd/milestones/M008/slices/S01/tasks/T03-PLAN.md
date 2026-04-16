---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: ListenBrainzService unit tests

Unit test ListenBrainzService. Focus: token-auth header shape, submit-listen payload structure, HTTP error branches. Mock HTTP client.

## Inputs

- `musicode-server/src/main/java/com/musicode/service/ListenBrainzService.java`

## Expected Output

- `ListenBrainzServiceTest.java covering submit success, 401, 5xx. ≥80% line coverage.`

## Verification

cd musicode-server && mvn -q -Dtest=ListenBrainzServiceTest test
