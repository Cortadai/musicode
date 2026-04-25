---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: LyricsPanel component — highlight + auto-scroll + fallbacks

Build LyricsPanel React component. For synced lyrics: highlight current line based on playback time, smooth auto-scroll to keep active line centered. For plain lyrics: static scrollable text. For instrumental: centered icon + message. For not-found: message + retry button. Styling with Tailwind: semi-transparent background, readable text, smooth transitions.

## Inputs

- `parseLrc output`
- `useLyrics hook`
- `Current playback time from usePlayer`

## Expected Output

- `LyricsPanel component with all states`

## Verification

Component renders all four states correctly. Auto-scroll follows playback time. Active line visually distinct.
