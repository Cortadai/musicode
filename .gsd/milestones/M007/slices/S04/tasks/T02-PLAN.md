---
estimated_steps: 7
estimated_files: 3
skills_used: []
---

# T02: Frontend ActivityFeed + SSE client

1. Create ActivityFeed component showing recent plays as a timeline
2. Use EventSource to connect to /api/activity/stream
3. Auto-reconnect on disconnect (EventSource handles this natively)
4. Show: avatar/icon, 'username listened to trackTitle by artist' with timestamp
5. Add to sidebar or as a collapsible panel
6. Fallback: fetch /api/activity/recent on mount for initial data
7. Run full test suite, commit

## Inputs

- `ActivityEvent shape`
- `SSE endpoint`

## Expected Output

- `ActivityFeed component`
- `Updated Sidebar or layout`
- `All tests passing`

## Verification

Play a track → activity feed shows the event in real-time. npx playwright test passes. mvn clean verify passes.
