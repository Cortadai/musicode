# S02: Player Polish — Shuffle, Repeat, Keyboard, Navigation

**Goal:** Complete playback experience: shuffle, repeat, keyboard shortcuts, and click cover art in player bar to navigate to album.
**Demo:** After this: Click cover in player bar → navigates to album. Shuffle an album. Repeat a track. Use Space/arrows to control playback.

## Tasks
- [x] **T01: Shuffle, repeat (off/all/one), keyboard shortcuts (Space/arrows/M), and cover art click navigates to album.** — Add shuffle and repeat state to PlayerContext. Add TOGGLE_SHUFFLE and TOGGLE_REPEAT actions. Shuffle creates a randomized copy of the queue. Repeat modes: off, all (loop queue), one (loop current track). Update NEXT action to respect repeat mode. Add keyboard event listener for Space, ArrowLeft, ArrowRight, M. Update PlayerBar with shuffle/repeat buttons and cover art Link.

Steps:
1. Add shuffle (boolean) and repeatMode ('off'|'all'|'one') to PlayerState
2. Add TOGGLE_SHUFFLE and TOGGLE_REPEAT actions to reducer
3. TOGGLE_SHUFFLE: shuffle the remaining queue, keep current track
4. NEXT with repeat-one: restart current track. NEXT with repeat-all: loop to start
5. Add toggleShuffle, toggleRepeat to usePlayer hook
6. Add useEffect for global keydown listener in AppShell
7. Update PlayerBar: add Shuffle and Repeat buttons with active state styling
8. Wrap cover art + title in Link to /albums/{albumId}
9. Verify all controls in browser
  - Estimate: 1.5h
  - Files: musicode-ui/src/context/PlayerContext.tsx, musicode-ui/src/hooks/usePlayer.ts, musicode-ui/src/components/player/PlayerBar.tsx, musicode-ui/src/components/layout/AppShell.tsx
  - Verify: Click shuffle → queue randomized. Click repeat → cycles off/all/one. Space pauses/resumes. Arrow keys navigate. Click cover in player bar → navigates to album page.
