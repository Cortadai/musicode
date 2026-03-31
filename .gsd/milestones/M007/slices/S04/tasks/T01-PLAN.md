---
estimated_steps: 8
estimated_files: 4
skills_used: []
---

# T01: SSE backend — ActivityService + controller

1. Create ActivityService with SseEmitter registry
2. Methods: addEmitter(SseEmitter), broadcast(ActivityEvent), removeEmitter
3. Create ActivityEvent record: username, trackTitle, artistName, albumTitle, coverUrl, timestamp
4. Create ActivityController with GET /api/activity/stream returning SseEmitter
5. Also GET /api/activity/recent for last 20 events (fallback for clients that miss SSE)
6. Hook into PlayController: after save, call activityService.broadcast()
7. Handle emitter cleanup on completion/timeout/error
8. Verify: curl SSE endpoint, play a track, see event arrive

## Inputs

- `PlayController`
- `SseEmitter docs`

## Expected Output

- `ActivityService.java`
- `ActivityController.java`
- `ActivityEvent.java`
- `Updated PlayController.java`

## Verification

curl /api/activity/stream receives SSE events when a play is recorded.
