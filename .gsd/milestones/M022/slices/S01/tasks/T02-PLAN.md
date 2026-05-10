---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: LyricsSidebar component + PlayerBar button

Create LyricsSidebar component that wraps LyricsPanel in a sidebar aside (same styling as QueuePanel). Add lyrics toggle button (Mic2 icon) to PlayerBar right section, with mutual exclusion logic (opening lyrics closes queue, opening queue closes lyrics).

## Inputs

- `QueuePanel.tsx sidebar pattern`
- `LyricsPanel.tsx`
- `PlayerBar.tsx`

## Expected Output

- `LyricsSidebar.tsx component`
- `PlayerBar with lyrics button and mutual exclusion`

## Verification

TypeScript compiles, button renders in PlayerBar
