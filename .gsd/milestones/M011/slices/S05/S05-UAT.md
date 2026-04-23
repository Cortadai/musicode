# S05: Error handling servicios externos + cleanup — UAT

**Milestone:** M011
**Written:** 2026-04-18T17:49:06.657Z

## UAT: S05 — Error handling servicios externos + cleanup

### Backend — Error Classification

| # | Scenario | Expected | Verify |
|---|----------|----------|--------|
| 1 | Last.fm returns 401 | ScrobbleResult(AUTH_ERROR), log contains LASTFM_AUTH_ERROR, no retry | WireMock test: scrobble_401_returnsAuthError |
| 2 | Last.fm returns 503 | ScrobbleResult(SERVER_ERROR), retryable | WireMock test: scrobble_503_returnsServerError |
| 3 | Last.fm connection reset | ScrobbleResult(TIMEOUT), retryable | WireMock test: scrobble_connectionReset_returnsTimeoutError |
| 4 | Last.fm API key blank | ScrobbleResult(CONFIG_ERROR), no HTTP call | Unit test: scrobble_returnsConfigErrorWhenConfigBlank |
| 5 | ListenBrainz returns 401 | ScrobbleResult(AUTH_ERROR), non-retryable | WireMock test: submitListen_401_returnsAuthError |
| 6 | ListenBrainz returns 503 | ScrobbleResult(SERVER_ERROR), retryable | WireMock test: submitListen_503_returnsServerError |
| 7 | ListenBrainz connection reset | ScrobbleResult(TIMEOUT), retryable | WireMock test: submitListen_serverClosesConnection_returnsTimeoutError |

### Backend — Smart Retry

| # | Scenario | Expected | Verify |
|---|----------|----------|--------|
| 8 | AUTH_ERROR from any provider | 1 call only, no retry | ScrobbleServiceTest: scrobble_authError_noRetry |
| 9 | CONFIG_ERROR from any provider | 1 call only, no retry | ScrobbleServiceTest: scrobble_configError_noRetry |
| 10 | TIMEOUT then success | Retries, succeeds on 2nd/3rd attempt | ScrobbleServiceTest: scrobble_retryableError_retriesWithBackoff |
| 11 | TIMEOUT exhausted | 3 attempts, then gives up | ScrobbleServiceTest: scrobble_retryableAlwaysFails_exhaustsAfter3Attempts |

### Frontend — AbortController

| # | Scenario | Expected | Verify |
|---|----------|----------|--------|
| 12 | AuthProvider unmounts during getMe | Request aborted, no state update on unmounted component | Code review: AbortController in useEffect cleanup |
| 13 | usePlayer unmounts during recordPlay | Request aborted via abortControllerRef | Code review: cleanup aborts in effect return |
| 14 | Build passes | No TypeScript errors in production build | npm run build succeeds |
