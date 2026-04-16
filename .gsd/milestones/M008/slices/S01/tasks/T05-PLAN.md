---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T05: ActivityService SSE broadcast tests

Unit test ActivityService. Focus: subscribe() returns a live SseEmitter and replays recent events from the ConcurrentLinkedDeque; broadcast() fans out to all active emitters; dead/IOException emitters are removed during broadcast; recent-events buffer caps at 20 (oldest evicted).

## Inputs

- `musicode-server/src/main/java/com/musicode/service/ActivityService.java`
- `musicode-server/src/main/java/com/musicode/model/dto/ActivityEvent.java`

## Expected Output

- `ActivityServiceTest.java covering: subscribe+replay, broadcast to N, dead emitter eviction, buffer cap. ≥80% line coverage.`

## Verification

cd musicode-server && mvn -q -Dtest=ActivityServiceTest test
