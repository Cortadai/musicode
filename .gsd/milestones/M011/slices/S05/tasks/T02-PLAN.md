---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: Smart retry in ScrobbleService — skip auth errors

Update ScrobbleService retry loop to inspect ScrobbleResult.errorType. Retry on TIMEOUT and SERVER_ERROR. Do NOT retry on AUTH_ERROR or CONFIG_ERROR — log once and bail. Preserve existing exponential backoff for retryable errors.

## Inputs

- `T01 ScrobbleResult with errorType`
- `Current ScrobbleService.java`
- `Current ScrobbleServiceTest.java`

## Expected Output

- `Retry logic checks errorType before retrying`
- `Tests verify no-retry for auth, retry for timeout`

## Verification

ScrobbleServiceTest updated with cases: auth error → no retry, timeout → retry with backoff. mvn test passes.
