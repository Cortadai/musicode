# S01: Backend — LRCLIB integration + DB cache — UAT

**Milestone:** M015
**Written:** 2026-04-25T15:45:51.297Z

## S01 UAT — Backend LRCLIB Integration\n\n- [x] GET /api/lyrics/{trackId} returns cached lyrics for known tracks\n- [x] First request triggers lazy LRCLIB fetch and caches result\n- [x] Subsequent requests return cached data without hitting LRCLIB\n- [x] NOT_FOUND status cached for tracks not in LRCLIB\n- [x] POST /api/lyrics/{trackId}/retry clears cache and re-fetches\n- [x] 401 returned for unauthenticated requests\n- [x] 404 returned for non-existent track IDs
