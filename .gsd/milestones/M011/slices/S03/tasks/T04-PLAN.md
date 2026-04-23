---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T04: Add landmark regions, labels, and decorative ARIA to PlayerBar, TrackInfo, and AlbumCard

PlayerBar: wrap in role='region' with aria-label='Music player'. TrackInfo: aria-hidden='true' on decorative vinyl animation, aria-label on album link. AlbumCard: ensure alt text and link label are descriptive. Visualizer canvas: aria-label='Audio visualizer'. Hide purely decorative elements from screen reader tree.

## Inputs

- `musicode-ui/src/components/player/PlayerBar.tsx`
- `musicode-ui/src/components/player/TrackInfo.tsx`
- `musicode-ui/src/components/library/AlbumCard.tsx`
- `musicode-ui/src/components/player/Visualizer.tsx`

## Expected Output

- `musicode-ui/src/components/player/PlayerBar.tsx`
- `musicode-ui/src/components/player/TrackInfo.tsx`
- `musicode-ui/src/components/library/AlbumCard.tsx`
- `musicode-ui/src/components/player/Visualizer.tsx`

## Verification

Screen reader landmark navigation finds 'Music player' region. Decorative elements not announced. Album links have descriptive labels.
