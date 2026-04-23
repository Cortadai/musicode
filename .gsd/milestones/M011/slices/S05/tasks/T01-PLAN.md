---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: Typed error classification in LastfmService and ListenBrainzService

Replace generic catch(Exception) with typed exception handling: HttpClientErrorException for 4xx (auth), HttpServerErrorException for 5xx, ResourceAccessException for timeout/network. Log each with distinct markers (LASTFM_AUTH_ERROR, LASTFM_TIMEOUT, etc). Create ScrobbleErrorType enum for classification.

## Inputs

- `Current LastfmService.java`
- `Current ListenBrainzService.java`
- `Knowledge entry #5 (WireMock contract tests)`

## Expected Output

- `ScrobbleResult DTO with success/errorType/message fields`
- `Typed catch blocks in both services`
- `Structured log lines with error classification`

## Verification

mvn test -pl musicode-server passes. Grep logs for typed error markers in existing tests.
