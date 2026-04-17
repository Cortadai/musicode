# S03: Playwright Extended Flows + CI Config — UAT

**Milestone:** M006
**Written:** 2026-04-17T19:56:34.243Z

## UAT — S03: Playwright Extended Flows + CI Config

| # | Scenario | Expected | Result |
|---|----------|----------|--------|
| 1 | Search: results found | Tracks and albums shown | ✅ Pass |
| 2 | Search: no results | Empty state message | ✅ Pass |
| 3 | Settings: admin view | Settings page with library folders | ✅ Pass |
| 4 | Nav: sidebar links | All links navigate correctly | ✅ Pass |
| 5 | Nav: tracks page | Track list with durations | ✅ Pass |
| 6 | Nav: full browse flow | Artists → artist → album → play | ✅ Pass |
| 7 | Error: non-existent album | Error state shown | ✅ Pass |
| 8 | Error: unauth access | Redirect to /login | ✅ Pass |
| 9 | Stats: dashboard | Summary and charts visible | ✅ Pass |
| 10 | Stats: period selector | Data updates on period change | ✅ Pass |
| 11 | CI config | Retries, reporters, artifacts | ✅ Configured |
