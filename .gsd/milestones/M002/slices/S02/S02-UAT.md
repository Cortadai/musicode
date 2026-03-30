# S02: Player Polish — Shuffle, Repeat, Keyboard, Navigation — UAT

**Milestone:** M002
**Written:** 2026-03-30T10:55:25.284Z

## UAT: S02 — Player Polish\n\n### Test 1: Shuffle\n1. Play an album, click shuffle button\n2. Click next several times\n3. **Expected:** Tracks play in random order. Shuffle icon is indigo when active.\n\n### Test 2: Repeat\n1. Click repeat button once (repeat-all): icon turns indigo\n2. Click again (repeat-one): icon changes to Repeat1\n3. Click again (off): icon goes gray\n4. With repeat-one: track restarts when it ends\n5. With repeat-all: queue loops from last to first\n\n### Test 3: Keyboard\n1. Press Space → play/pause toggles\n2. Press ArrowRight → next track\n3. Press ArrowLeft → prev track or restart\n4. Press M → mute/unmute\n5. Type in search bar → shortcuts don't fire\n\n### Test 4: Album Navigation\n1. Click cover art image in player bar\n2. **Expected:** Navigates to /albums/{id} of the playing track"
