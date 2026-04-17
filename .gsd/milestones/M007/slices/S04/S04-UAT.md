# S04: Activity Feed (Server-Sent Events) — UAT

**Milestone:** M007
**Written:** 2026-04-17T19:35:19.011Z

## UAT: S04 — Activity Feed\n\n- [x] GET /api/activity/stream returns SSE content-type\n- [x] Play a track → SSE event arrives at connected clients\n- [x] GET /api/activity/recent returns last 20 events\n- [x] Two browser tabs: play in A → B shows event in real-time\n- [x] EventSource auto-reconnects on disconnect\n- [x] Dead emitters cleaned up during broadcast
