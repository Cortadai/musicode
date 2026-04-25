# S01: Cassette Canvas — Body, Reels & Tape Physics

**Goal:** Build the cassette canvas foundation: full-screen RetroMode shell, cassette body rendering (carcasa, window, label, screws), reel physics with accurate tape winding, and tape path animation synchronized to player state.
**Demo:** Full-screen canvas showing a detailed cassette with two reels spinning at physically accurate speeds, tape path moving between them, and label displaying current track info with album colors

## Must-Haves

- 1. A dedicated RetroMode button in PlayerBar opens a full-screen cassette deck experience. 2. Canvas renders a detailed cassette body with transparent window, label area, guide posts, and screws. 3. Two reels spin with physically accurate angular velocity (constant linear tape speed → variable angular speed based on tape radius). 4. Tape visually transfers from left reel to right reel as track progresses. 5. Play/pause/seek correctly drive reel animation (spin, decelerate, jump). 6. Track metadata (title, artist, album) renders on the cassette label. 7. ESC closes retro mode, returning to normal view.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [ ] **T01: RetroMode shell and entry point** `est:25min`
  Create the RetroMode component as a full-screen portal (like NowPlayingOverlay but independent). Add a cassette icon button to PlayerBar right controls. Wire up open/close state, ESC key handling, and pass player state (currentTrack, isPlaying, currentTime, duration, seek, pause, resume, next, prev) into the shell. The shell renders a dark background container ready for canvas children.
  - Files: `musicode-ui/src/components/player/RetroMode.tsx`, `musicode-ui/src/components/player/PlayerBar.tsx`
  - Verify: Button visible in PlayerBar, click opens full-screen dark overlay, ESC closes it, player state accessible inside

- [ ] **T02: Cassette body canvas rendering** `est:40min`
  Create CassetteCanvas component using Canvas 2D. Draw the cassette body: outer shell with rounded corners, transparent window area, two hub circles (empty reels), screw holes at corners, guide posts and pressure pad below the tape path, head gap. Use warm retro colors (dark plastic body, slightly transparent brown window). The canvas must be responsive — scale to fit the container while maintaining aspect ratio. Support devicePixelRatio for crisp rendering on HiDPI displays.
  - Files: `musicode-ui/src/components/player/cassette/CassetteCanvas.tsx`
  - Verify: Canvas renders a recognizable cassette body at multiple container sizes, crisp on HiDPI

- [ ] **T03: Reel physics and tape winding animation** `est:45min`
  Implement reel animation with accurate tape physics. Each reel has a hub radius and tape radius that changes with progress (left shrinks, right grows). Angular velocity = linearSpeed / currentRadius (constant linear tape speed). Tape is visible as brown area on each reel (hub to tape radius). Use requestAnimationFrame loop. Props: progress (0-1), isPlaying (drives spin), onFrame callback for parent sync. When paused, reels decelerate with inertia wobble. When seeking, reels spin at accelerated speed in the correct direction.
  - Files: `musicode-ui/src/components/player/cassette/CassetteCanvas.tsx`, `musicode-ui/src/components/player/cassette/reelPhysics.ts`
  - Verify: Reels spin when playing, left reel shrinks and right grows over track duration, pause causes deceleration, seek causes fast-forward visual

- [ ] **T04: Cassette label and player integration** `est:35min`
  Render the cassette label inside the body using canvas text (or DOM overlay for better typography). Label shows: 'MUSICODE' brand top-left, 'C-90' duration badge, track title in typewriter font, artist and album below. Wire CassetteCanvas into RetroMode shell with full player state: currentTime/duration drives progress, isPlaying drives animation, track change updates label with crossfade. Add basic transport controls below the cassette (reuse TransportControls component).
  - Files: `musicode-ui/src/components/player/cassette/CassetteCanvas.tsx`, `musicode-ui/src/components/player/RetroMode.tsx`
  - Verify: Label shows current track info, transport controls work, track changes update label, tsc clean

## Files Likely Touched

- musicode-ui/src/components/player/RetroMode.tsx
- musicode-ui/src/components/player/PlayerBar.tsx
- musicode-ui/src/components/player/cassette/CassetteCanvas.tsx
- musicode-ui/src/components/player/cassette/reelPhysics.ts
