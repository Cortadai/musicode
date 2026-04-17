---
id: T01
parent: S04
milestone: M007
key_files:
  - musicode-server/src/main/java/com/musicode/service/ActivityService.java
  - musicode-server/src/main/java/com/musicode/controller/ActivityController.java
  - musicode-server/src/main/java/com/musicode/model/dto/ActivityEvent.java
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-17T19:35:04.497Z
blocker_discovered: false
---

# T01: SSE backend — ActivityService with emitter registry and ActivityController

**SSE backend — ActivityService with emitter registry and ActivityController**

## What Happened

Created ActivityService with CopyOnWriteArrayList for SseEmitter registry. Broadcast method sends ActivityEvent to all connected clients, cleans dead emitters. ConcurrentLinkedDeque buffers last 20 events for /api/activity/recent fallback. ActivityController: GET /api/activity/stream (SSE) and GET /api/activity/recent. Hooked into PlayController for automatic broadcast on play. Commit: a4ab00a.

## Verification

curl /api/activity/stream receives SSE events when a play is recorded.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `curl /api/activity/stream` | 0 | pass | 10000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/main/java/com/musicode/service/ActivityService.java`
- `musicode-server/src/main/java/com/musicode/controller/ActivityController.java`
- `musicode-server/src/main/java/com/musicode/model/dto/ActivityEvent.java`
