# Requirements

This file is the explicit capability and coverage contract for the project.

## Validated

### R001 — Backend scans configured filesystem folders recursively, reads audio file metadata (title, artist, album, track number, duration, bitrate, sample rate, genre, year, cover art) using JAudioTagger, and persists to database. Incremental rescan detects only new/changed files.
- Class: core-capability
- Status: validated
- Description: Backend scans configured filesystem folders recursively, reads audio file metadata (title, artist, album, track number, duration, bitrate, sample rate, genre, year, cover art) using JAudioTagger, and persists to database. Incremental rescan detects only new/changed files.
- Why it matters: Without scanning, there's no library — everything else depends on this.
- Source: user
- Primary owning slice: M001/S01
- Supporting slices: M002/S01 (multi-format)
- Validation: M001 S01 — Scanner processes FLAC/MP3/OGG/M4A recursively, reads metadata with JAudioTagger 2.2.5, persists to H2. Incremental rescan via filePath UNIQUE constraint. Async with progress. Tested with 227 real tracks.
- Notes: Supports FLAC, MP3, OGG, M4A at minimum. Async scanning with progress status.

### R002 — Backend serves audio files via HTTP with Range header support (206 Partial Content), enabling instant seeking to any position without downloading the full file.
- Class: core-capability
- Status: validated
- Description: Backend serves audio files via HTTP with Range header support (206 Partial Content), enabling instant seeking to any position without downloading the full file.
- Why it matters: FLAC files are 30-80MB. Without Range support, seeking is impossible and playback unusable.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: none
- Validation: M001 S03 — AudioStreamService handles HTTP Range headers (open-ended, suffix, explicit). Returns 206 Partial Content with Content-Range. Seeking works instantly on 30-80MB FLACs in browser.
- Notes: Spring ResourceRegion or manual Range header handling.

### R003 — REST API exposes paginated, filterable, searchable endpoints for tracks, albums, and artists. Includes combined search endpoint.
- Class: primary-user-loop
- Status: validated
- Description: REST API exposes paginated, filterable, searchable endpoints for tracks, albums, and artists. Includes combined search endpoint.
- Why it matters: The API is how the frontend accesses the library. Pagination is essential for large collections.
- Source: user
- Primary owning slice: M001/S02
- Supporting slices: none
- Validation: M001 S02 — Paginated REST endpoints for tracks, albums, artists with filtering and sorting. Combined search endpoint. EntityGraph for detail views, Hibernate6Module for list serialization.
- Notes: Filter by artist, album. Sort by title, year, track number, etc.

### R004 — Album cover art is extracted from audio file metadata during scan, cached as JPG on disk, and served via a dedicated endpoint. Frontend displays cover art in album views and player.
- Class: primary-user-loop
- Status: validated
- Description: Album cover art is extracted from audio file metadata during scan, cached as JPG on disk, and served via a dedicated endpoint. Frontend displays cover art in album views and player.
- Why it matters: Cover art is the visual identity of a music library — without it, the UI feels broken.
- Source: user
- Primary owning slice: M001/S03
- Supporting slices: M002/S02 (cover art navigation)
- Validation: M001 S03 — Cover art extracted from audio metadata during scan, cached as {albumId}.jpg on disk, served via /api/covers/{albumId} with Cache-Control 7 days. Fallback placeholder in UI. Cover art navigation added in M002/S02.
- Notes: Fallback placeholder for tracks without embedded art.

### R005 — Frontend plays audio streamed from the backend using HTML5 Audio element. Supports play, pause, seek, next, previous, volume control. Global player state persists across page navigation.
- Class: core-capability
- Status: validated
- Description: Frontend plays audio streamed from the backend using HTML5 Audio element. Supports play, pause, seek, next, previous, volume control. Global player state persists across page navigation.
- Why it matters: This is the core product — if you can't play music, nothing else matters.
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: M002/S02 (shuffle, repeat, keyboard shortcuts)
- Validation: M001 S04 — Singleton Audio element, PlayerContext with useReducer. Play/pause/seek/next/prev/volume. Global state persists across navigation. Shuffle and repeat modes added in M002/S02. Keyboard shortcuts (Space, arrows) in M002/S02.
- Notes: FLAC natively supported in Chrome, Edge, Firefox. PlayerContext with useReducer.

### R006 — User can add, list, and remove library folders through the UI and API. Adding a folder makes it available for scanning.
- Class: primary-user-loop
- Status: validated
- Description: User can add, list, and remove library folders through the UI and API. Adding a folder makes it available for scanning.
- Why it matters: Users need to tell the system where their music is before anything works.
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: M001 S04 — Settings page with add/list/remove library folders. POST/GET/DELETE /api/library/folders endpoints. Adding folder triggers scan availability.
- Notes: Settings page in UI.

### R007 — User can build and manage a playback queue. Clicking a track in any view starts playback and queues the context (album, artist tracks, search results). Shuffle and repeat modes supported.
- Class: primary-user-loop
- Status: validated
- Description: User can build and manage a playback queue. Clicking a track in any view starts playback and queues the context (album, artist tracks, search results). Shuffle and repeat modes supported.
- Why it matters: Playing a single track at a time would make the player unusable for actual listening sessions.
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: M002/S02 (shuffle, repeat modes)
- Validation: M001 S04 + M002 S02 — Click-to-play queues album/artist context. Queue persists across navigation. Shuffle randomizes order, repeat loops track/queue. 22 reducer tests covering all queue operations.
- Notes: Queue persists across navigation. Shuffle randomizes order, repeat loops track/queue.

### R008 — Frontend provides a clean, modern UI with sidebar navigation, content area, and persistent bottom player bar. Custom theme (not forced dark). Responsive layout. Loading skeletons, error boundaries, empty states.
- Class: launchability
- Status: validated
- Description: Frontend provides a clean, modern UI with sidebar navigation, content area, and persistent bottom player bar. Custom theme (not forced dark). Responsive layout. Loading skeletons, error boundaries, empty states.
- Why it matters: The whole point is "my own VLC but prettier" — the UI must look good and feel polished.
- Source: user
- Primary owning slice: M001/S04
- Supporting slices: none
- Validation: M001 S04 — Dark theme (zinc + indigo), sidebar navigation, content area, persistent bottom player bar. Lucide icons. Loading skeletons, empty states. Responsive layout. Tailwind CSS.
- Notes: Inspired by Monochrome Music aesthetic. Lucide icons. Tailwind CSS.

### R009 — Entire stack (backend + frontend) runs via a single `docker-compose up`. Music folder mounted as read-only volume. H2 data persisted in a volume.
- Class: operability
- Status: validated
- Description: Entire stack (backend + frontend) runs via a single `docker-compose up`. Music folder mounted as read-only volume. H2 data persisted in a volume.
- Why it matters: Portability — move to any machine, run one command, works.
- Source: user
- Primary owning slice: M001/S05
- Supporting slices: none
- Validation: M001 S05 — docker-compose.yml with Spring Boot serving React static build. Music folder mounted read-only. H2 data persisted in volume. Single docker-compose up starts everything.
- Notes: Frontend can be served from Spring Boot static resources or separate nginx container.

### R010 — Real-time audio spectrum visualizer using Web Audio API AnalyserNode, rendered on Canvas/SVG.
- Class: differentiator
- Status: validated
- Description: Real-time audio spectrum visualizer using Web Audio API AnalyserNode, rendered on Canvas/SVG.
- Why it matters: Visual flair that distinguishes this from boring players.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: M005/S03 — Canvas 2D frequency bars from Web Audio API AnalyserNode, toggleable from PlayerBar, 60fps with Page Visibility awareness.
- Notes: Deferred to post-MVP (Phase 2 in original plan).

### R011 — Browser Media Session API integration so OS-level media controls (play/pause/next/prev keys) work with the player.
- Class: quality-attribute
- Status: validated
- Description: Browser Media Session API integration so OS-level media controls (play/pause/next/prev keys) work with the player.
- Why it matters: Without this, keyboard media keys do nothing — feels broken on desktop.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: M005/S01 — Media Session API integrated in usePlayer.ts. OS media keys (play/pause/next/prev), now-playing overlay with track/artist/cover art, OS seek bar.
- Notes: Deferred to post-MVP (Phase 2).

### R012 — App installable as PWA with manifest.json and service worker. Opens in its own window without browser chrome.
- Class: quality-attribute
- Status: validated
- Description: App installable as PWA with manifest.json and service worker. Opens in its own window without browser chrome.
- Why it matters: Makes the web app feel native — own window, own icon, offline UI shell.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: M005/S02 — manifest.json, hand-written service worker (network-first shell, cache-first covers, network-only API), installable as standalone window.
- Notes: Deferred to post-MVP (Phase 2).

## Deferred

### R013 — Scrobble completed tracks to Last.fm and/or ListenBrainz for listening history.
- Class: integration
- Status: deferred
- Description: Scrobble completed tracks to Last.fm and/or ListenBrainz for listening history.
- Why it matters: Long-term listening stats and recommendations.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to Phase 3.

### R014 — Implement core Subsonic/OpenSubsonic API endpoints so existing mobile clients (Symfonium, DSub, etc.) can connect.
- Class: integration
- Status: deferred
- Description: Implement core Subsonic/OpenSubsonic API endpoints so existing mobile clients (Symfonium, DSub, etc.) can connect.
- Why it matters: Free mobile client ecosystem without building a mobile app.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to Phase 3. Only core endpoints needed.

### R015 — Transcode FLAC to OGG/OPUS on the fly for bandwidth-constrained clients.
- Class: differentiator
- Status: deferred
- Description: Transcode FLAC to OGG/OPUS on the fly for bandwidth-constrained clients.
- Why it matters: Mobile streaming over cellular without burning data.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to Phase 4. Requires ffmpeg integration.

## Out of Scope

### R016 — No integration with TIDAL, Spotify, Deezer, or any DRM-protected streaming service.
- Class: anti-feature
- Status: out-of-scope
- Description: No integration with TIDAL, Spotify, Deezer, or any DRM-protected streaming service.
- Why it matters: This is a local-files-only player. Prevents scope creep and legal issues.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: n/a
- Notes: The PLAN.md mentions a future "Stream Player" module — that's a separate future project, not part of this scope.

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| R001 | core-capability | validated | M001/S01 | M002/S01 (multi-format) | M001 S01 — Scanner processes FLAC/MP3/OGG/M4A recursively, reads metadata with JAudioTagger 2.2.5, persists to H2. Incremental rescan via filePath UNIQUE constraint. Async with progress. Tested with 227 real tracks. |
| R002 | core-capability | validated | M001/S03 | none | M001 S03 — AudioStreamService handles HTTP Range headers (open-ended, suffix, explicit). Returns 206 Partial Content with Content-Range. Seeking works instantly on 30-80MB FLACs in browser. |
| R003 | primary-user-loop | validated | M001/S02 | none | M001 S02 — Paginated REST endpoints for tracks, albums, artists with filtering and sorting. Combined search endpoint. EntityGraph for detail views, Hibernate6Module for list serialization. |
| R004 | primary-user-loop | validated | M001/S03 | M002/S02 (cover art navigation) | M001 S03 — Cover art extracted from audio metadata during scan, cached as {albumId}.jpg on disk, served via /api/covers/{albumId} with Cache-Control 7 days. Fallback placeholder in UI. Cover art navigation added in M002/S02. |
| R005 | core-capability | validated | M001/S04 | M002/S02 (shuffle, repeat, keyboard shortcuts) | M001 S04 — Singleton Audio element, PlayerContext with useReducer. Play/pause/seek/next/prev/volume. Global state persists across navigation. Shuffle and repeat modes added in M002/S02. Keyboard shortcuts (Space, arrows) in M002/S02. |
| R006 | primary-user-loop | validated | M001/S04 | none | M001 S04 — Settings page with add/list/remove library folders. POST/GET/DELETE /api/library/folders endpoints. Adding folder triggers scan availability. |
| R007 | primary-user-loop | validated | M001/S04 | M002/S02 (shuffle, repeat modes) | M001 S04 + M002 S02 — Click-to-play queues album/artist context. Queue persists across navigation. Shuffle randomizes order, repeat loops track/queue. 22 reducer tests covering all queue operations. |
| R008 | launchability | validated | M001/S04 | none | M001 S04 — Dark theme (zinc + indigo), sidebar navigation, content area, persistent bottom player bar. Lucide icons. Loading skeletons, empty states. Responsive layout. Tailwind CSS. |
| R009 | operability | validated | M001/S05 | none | M001 S05 — docker-compose.yml with Spring Boot serving React static build. Music folder mounted read-only. H2 data persisted in volume. Single docker-compose up starts everything. |
| R010 | differentiator | validated | none | none | M005/S03 — Canvas 2D frequency bars from Web Audio API AnalyserNode, toggleable from PlayerBar, 60fps with Page Visibility awareness. |
| R011 | quality-attribute | validated | none | none | M005/S01 — Media Session API integrated in usePlayer.ts. OS media keys (play/pause/next/prev), now-playing overlay with track/artist/cover art, OS seek bar. |
| R012 | quality-attribute | validated | none | none | M005/S02 — manifest.json, hand-written service worker (network-first shell, cache-first covers, network-only API), installable as standalone window. |
| R013 | integration | deferred | none | none | unmapped |
| R014 | integration | deferred | none | none | unmapped |
| R015 | differentiator | deferred | none | none | unmapped |
| R016 | anti-feature | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 0
- Mapped to slices: 0
- Validated: 12 (R001, R002, R003, R004, R005, R006, R007, R008, R009, R010, R011, R012)
- Unmapped active requirements: 0
