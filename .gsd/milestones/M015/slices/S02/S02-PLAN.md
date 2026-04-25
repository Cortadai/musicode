# S02: Frontend — Lyrics panel + NowPlaying integration

**Goal:** Build LyricsPanel with LRC parsing, auto-scroll, and integrate into NowPlayingOverlay
**Demo:** Playing a track shows synced lyrics with auto-scroll highlighting in NowPlayingOverlay

## Must-Haves

- Synced lyrics highlight current line and auto-scroll. Plain lyrics display statically. Instrumental and not-found states render appropriate messages. Toggle button controls panel visibility.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: LRC parser utility + lyrics API hook** `est:45min`
  Create parseLrc utility that parses [mm:ss.xx] text lines into {time: number, text: string}[] array. Handle edge cases: empty lines, malformed timestamps, enhanced LRC format, BOM. Create useLyrics React hook that fetches from /api/lyrics/{trackId} on track change, exposes lyrics data + status + retry function.
  - Files: `musicode-frontend/src/utils/lrcParser.ts`, `musicode-frontend/src/hooks/useLyrics.ts`, `musicode-frontend/src/api/lyrics.ts`
  - Verify: TypeScript compiles. Parser correctly handles standard LRC samples, empty lines, and malformed input.

- [x] **T02: LyricsPanel component — highlight + auto-scroll + fallbacks** `est:1.5h`
  Build LyricsPanel React component. For synced lyrics: highlight current line based on playback time, smooth auto-scroll to keep active line centered. For plain lyrics: static scrollable text. For instrumental: centered icon + message. For not-found: message + retry button. Styling with Tailwind: semi-transparent background, readable text, smooth transitions.
  - Files: `musicode-frontend/src/components/LyricsPanel.tsx`, `musicode-frontend/src/components/LyricsPanel.css`
  - Verify: Component renders all four states correctly. Auto-scroll follows playback time. Active line visually distinct.

- [x] **T03: NowPlayingOverlay integration — toggle + split layout** `est:1.5h`
  Add lyrics toggle button (microphone icon) to NowPlayingOverlay toolbar. When active: split layout with cover+controls on left (narrower), LyricsPanel on right. When inactive: existing full layout. Persist toggle state in localStorage. Fetch lyrics on track change when panel is visible. Ensure visualizer still renders behind the overlay.
  - Files: `musicode-frontend/src/components/NowPlayingOverlay.tsx`
  - Verify: Toggle shows/hides lyrics panel. Split layout renders correctly. Visualizer unaffected. State persists across page refreshes. No regressions in existing NowPlaying UX.

## Files Likely Touched

- musicode-frontend/src/utils/lrcParser.ts
- musicode-frontend/src/hooks/useLyrics.ts
- musicode-frontend/src/api/lyrics.ts
- musicode-frontend/src/components/LyricsPanel.tsx
- musicode-frontend/src/components/LyricsPanel.css
- musicode-frontend/src/components/NowPlayingOverlay.tsx
