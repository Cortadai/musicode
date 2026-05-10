---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Horizontal scroll carousels — recently played, top albums, top artists

Build a reusable Carousel component with horizontal scroll, snap behavior, and optional scroll arrows. Wire up 3 carousels on HomePage: (1) Recently Played using /activity/recent with album cover art, (2) Top Albums using /stats/top-albums with cover art, (3) Top Artists using /stats/top-artists. Each carousel item is a glassmorphism card with cover image, title, subtitle, and click navigation to detail page.

## Inputs

- `musicode-ui/src/api/stats.ts (getTopAlbums, getTopArtists)`
- `musicode-ui/src/api/activity.ts (getRecentActivity)`
- `musicode-ui/src/components/library/AlbumCard.tsx (card pattern reference)`

## Expected Output

- `Carousel.tsx reusable component`
- `CarouselCard.tsx glassmorphism card`
- `HomePage updated with 3 data-driven carousels`

## Verification

3 carousels render with real data, horizontal scroll works with snap, cards show cover art, clicking navigates to detail page, responsive sizing, TypeScript compiles clean.
