---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T04: ScrobbleService retry orchestration tests

Unit test ScrobbleService. Focus: @Async retry with exponential backoff (1s→2s→4s, max 3 attempts), fire-and-forget behavior (never throws), per-user provider selection (Lastfm vs ListenBrainz vs both vs neither). Mock LastfmService and ListenBrainzService. Use short backoff override or inject a Sleeper abstraction if needed to avoid slow tests.

## Inputs

- `musicode-server/src/main/java/com/musicode/service/ScrobbleService.java`

## Expected Output

- `ScrobbleServiceTest.java covering: first-try success, retry-then-success, retry-exhaustion, provider-disabled skip, throw-swallowing. ≥80% line coverage. Tests complete in <2s total.`

## Verification

cd musicode-server && mvn -q -Dtest=ScrobbleServiceTest test
