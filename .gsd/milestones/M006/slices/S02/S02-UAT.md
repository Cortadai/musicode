# S02: Playwright E2E — Setup + Core Flows — UAT

**Milestone:** M006
**Written:** 2026-04-17T19:56:00.182Z

## UAT — S02: Playwright E2E — Setup + Core Flows

| # | Scenario | Expected | Result |
|---|----------|----------|--------|
| 1 | Smoke: unauthenticated redirect | Redirect to /login | ✅ Pass |
| 2 | Login: valid credentials | Redirect to app shell | ✅ Pass |
| 3 | Login: invalid credentials | Error message shown | ✅ Pass |
| 4 | Logout | Redirect to /login, blocks re-access | ✅ Pass |
| 5 | Browse: albums page | Album cards with covers | ✅ Pass |
| 6 | Browse: album detail | Track list visible | ✅ Pass |
| 7 | Browse: artists page | Artist list renders | ✅ Pass |
| 8 | Browse: artist detail | Albums shown | ✅ Pass |
| 9 | Playback: click track | Player bar with track info | ✅ Pass |
| 10 | Admin: CRUD cycle | Create → verify → delete | ✅ Pass |
| 11 | Admin: self-delete protection | Error on self-delete | ✅ Pass |
