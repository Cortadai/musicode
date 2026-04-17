# S03: Scrobbling — Last.fm & ListenBrainz — UAT

**Milestone:** M007
**Written:** 2026-04-17T19:34:57.762Z

## UAT: S03 — Scrobbling\n\n- [x] Configure ListenBrainz token in settings → status shows connected\n- [x] Configure Last.fm via username/password → session key obtained, status connected\n- [x] Play a track past 50% → scrobble log entry for enabled services\n- [x] Disconnect a service → scrobble stops for that service\n- [x] WireMock contract tests pass for both services\n- [x] Async execution doesn't block playback response\n- [x] Retry with backoff on transient failures
