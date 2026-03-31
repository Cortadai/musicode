# S04: Activity Feed (Server-Sent Events)

**Goal:** Real-time listening activity feed via SSE. Shows what users are listening to.
**Demo:** After this: After this: open two browser tabs with different users. Play a track in tab A → tab B shows 'User X listened to Track Y' within seconds.

## Tasks
- [ ] **T01: SSE backend — ActivityService + controller** — 1. Create ActivityService with SseEmitter registry
2. Methods: addEmitter(SseEmitter), broadcast(ActivityEvent), removeEmitter
3. Create ActivityEvent record: username, trackTitle, artistName, albumTitle, coverUrl, timestamp
4. Create ActivityController with GET /api/activity/stream returning SseEmitter
5. Also GET /api/activity/recent for last 20 events (fallback for clients that miss SSE)
6. Hook into PlayController: after save, call activityService.broadcast()
7. Handle emitter cleanup on completion/timeout/error
8. Verify: curl SSE endpoint, play a track, see event arrive
  - Estimate: 35min
  - Files: musicode-server/src/main/java/com/musicode/service/ActivityService.java, musicode-server/src/main/java/com/musicode/controller/ActivityController.java, musicode-server/src/main/java/com/musicode/model/dto/ActivityEvent.java, musicode-server/src/main/java/com/musicode/controller/PlayController.java
  - Verify: curl /api/activity/stream receives SSE events when a play is recorded.
- [ ] **T02: Frontend ActivityFeed + SSE client** — 1. Create ActivityFeed component showing recent plays as a timeline
2. Use EventSource to connect to /api/activity/stream
3. Auto-reconnect on disconnect (EventSource handles this natively)
4. Show: avatar/icon, 'username listened to trackTitle by artist' with timestamp
5. Add to sidebar or as a collapsible panel
6. Fallback: fetch /api/activity/recent on mount for initial data
7. Run full test suite, commit
  - Estimate: 30min
  - Files: musicode-ui/src/components/activity/ActivityFeed.tsx, musicode-ui/src/components/layout/Sidebar.tsx, musicode-ui/src/api/activity.ts
  - Verify: Play a track → activity feed shows the event in real-time. npx playwright test passes. mvn clean verify passes.
