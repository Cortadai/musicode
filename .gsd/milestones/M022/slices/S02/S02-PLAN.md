# S02: Album Detail Enrichment

**Goal:** Enrich album detail page with audio quality badges, Last.fm link, and togglable related albums strip
**Demo:** Open any album detail page → header shows audio quality badges. If Last.fm has artist data, bio excerpt appears. Other albums by same artist shown in horizontal scroll.

## Must-Haves

- Not provided.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Album detail enrichment — badges, Last.fm link, related albums** `est:1 step`
  Add audio quality badges above ALBUM label, inline Last.fm link, backend bio endpoint, and togglable related albums strip with animated Disc3 button
  - Files: `AlbumInfoCard.tsx`, `AlbumDetailPage.tsx`, `artists.ts`, `ArtistBioDTO.java`, `LastfmService.java`, `ArtistController.java`
  - Verify: Browser verification of badges, link, and related albums toggle

## Files Likely Touched

- AlbumInfoCard.tsx
- AlbumDetailPage.tsx
- artists.ts
- ArtistBioDTO.java
- LastfmService.java
- ArtistController.java
