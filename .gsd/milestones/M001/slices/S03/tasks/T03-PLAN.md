---
estimated_steps: 9
estimated_files: 7
skills_used: []
---

# T03: Library pages — albums grid, album detail, artists, tracks

Implement the library browsing pages that connect to the real API: Albums grid with cover art, Album detail with track list, Artists list, Artist detail with albums, Tracks list. Use TanStack Query for data fetching.

Steps:
1. AlbumsPage: fetch /api/albums, render grid of album cards with cover art from /api/covers/{albumId}
2. AlbumDetailPage: fetch /api/albums/{id}, show album info + track list
3. ArtistsPage: fetch /api/artists, render artist list
4. ArtistDetailPage: fetch /api/artists/{id}, show artist info + album cards
5. TracksPage: fetch /api/tracks, render scrollable track list
6. Create reusable components: AlbumCard, TrackList
7. Verify all pages load real data

## Inputs

- `musicode-ui/src/api/albums.ts`
- `musicode-ui/src/api/artists.ts`
- `musicode-ui/src/api/tracks.ts`
- `musicode-ui/src/types/index.ts`

## Expected Output

- `musicode-ui/src/pages/AlbumsPage.tsx`
- `musicode-ui/src/pages/AlbumDetailPage.tsx`
- `musicode-ui/src/pages/TracksPage.tsx`

## Verification

Open albums page — grid of album cards with cover art images. Click album — detail page shows tracks. Artists page lists artists. Tracks page shows all tracks.
