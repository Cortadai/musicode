# S01: Backend: Health Service + API endpoints — UAT

**Milestone:** M014
**Written:** 2026-04-25T17:07:34.897Z

## UAT: Backend Health Service\n\n- [x] GET /api/library/health/summary returns JSON with counts per issue type\n- [x] GET /api/library/health/issues?type=MISSING_ARTIST&page=0&size=20 returns paginated results\n- [x] All 8 health check types implemented and returning correct data\n- [x] Endpoints require authentication (401 without token)\n- [x] Integration tests cover all checks with edge cases
