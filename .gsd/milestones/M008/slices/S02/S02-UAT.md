# S02: Scrobble Integration Verification — UAT

**Milestone:** M008
**Written:** 2026-04-17T15:58:33.412Z

## UAT: S02 — Scrobble Integration Verification

### Pre-conditions
- musicode-server builds and all tests pass (`mvn verify`)

### Test Cases

| # | Scenario | Steps | Expected | Status |
|---|----------|-------|----------|--------|
| 1 | ScrobbleController GET settings | Run `ScrobbleControllerTest$GetSettings` | 3 tests pass: disconnected state, connected+masked state, 401 unauth | PASS |
| 2 | ScrobbleController PUT settings | Run `ScrobbleControllerTest$UpdateSettings` | 6 tests pass: LB connect, LB disconnect, LF auth success, LF disconnect, LF auth fail→400, 401 unauth | PASS |
| 3 | ScrobbleController DELETE endpoints | Run `ScrobbleControllerTest$DisconnectLastfm` and `$DisconnectListenBrainz` | 4 tests pass: disconnect returns updated settings, idempotent disconnect | PASS |
| 4 | DTO mask() edge cases | Run `ScrobbleSettingsResponseTest$Mask` | 6 tests: null, empty, short, exactly-8, 9-char boundary, normal | PASS |
| 5 | DTO from() edge cases | Run `ScrobbleSettingsResponseTest$From` | 4 tests: both tokens, no tokens, blank tokens, partial | PASS |
| 6 | Play→Scrobble integration | Run `PlayScrobbleIntegrationTest` | 4 tests: correct event to scrobble, broadcast called, no-body still scrobbles, invalid track→no scrobble | PASS |
| 7 | Coverage gate | `mvn verify` | 229 tests pass, JaCoCo gate met | PASS |

### Verdict
All 27 new tests pass. Coverage gate holds. No regressions.
