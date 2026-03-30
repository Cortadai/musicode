# S03: Test Suite Foundation — UAT

**Milestone:** M002
**Written:** 2026-03-30T19:46:00.401Z

## UAT: Test Suite Foundation\n\n### Test 1: Backend test suite\n- Run: `cd musicode-server && mvn test`\n- Expected: BUILD SUCCESS, 16 tests run, 0 failures\n\n### Test 2: Frontend test suite\n- Run: `cd musicode-ui && npm test`\n- Expected: 29 tests passed, 0 failures\n\n### Test 3: Backend API coverage\n- Albums: list (paginated), detail (with tracks), 404\n- Artists: list (paginated), detail (with albums), 404\n- Tracks: list (paginated), detail (with metadata), 404\n- Search: multi-entity match, artist match, blank query, no-match\n\n### Test 4: Frontend logic coverage\n- formatDuration: null, 0, seconds, minutes, padding, large values\n- playerReducer: PLAY_TRACK, PAUSE, RESUME, NEXT (normal/end/repeat-all/repeat-one), PREV (restart/>3s/back/repeat-all), TOGGLE_SHUFFLE (on/off), TOGGLE_REPEAT (cycle), SET_VOLUME (normal/clamp), SET_TIME, SET_DURATION, STOP
