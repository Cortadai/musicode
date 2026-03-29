# Requirements

This file is the explicit capability and coverage contract for the project.

## Active

### R001 — Library Scanning
- Class: core-capability
- Status: active
- Description: Backend scans configured filesystem folders recursively, reads audio file metadata (title, artist, album, track number, duration, bitrate, sample rate, genre, year, cover art) using JAudioTagger, and persists to database. Incremental rescan detects only new/changed files.
- Why it matters: Without scanning, there's no library — everything else depends on this.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped
- Notes: Supports FLAC, MP3, OGG, M4A at minimum. Async scanning with progress status.

### R002 — Audio Streaming with Seek
- Class: core-capability
- Status: active
- Description: Backend serves audio files via HTTP with Range header support (206 Partial Content), enabling instant seeking to any position without downloading the full file.
- Why it matters: FLAC files are 30-80MB. Without Range support, seeking is impossible and playback unusable.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped
- Notes: Spring ResourceRegion or manual Range header handling.

### R003 — Library Browsing API
- Class: primary-user-loop
- Status: active
- Description: REST API exposes paginated, filterable, searchable endpoints for tracks, albums, and artists. Includes combined search endpoint.
- Why it matters: The API is how the frontend accesses the library. Pagination is essential for large collections.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped
- Notes: Filter by artist, album. Sort by title, year, track number, etc.

### R004 — Cover Art Extraction and Display
- Class: primary-user-loop
- Status: active
- Description: Album cover art is extracted from audio file metadata during scan, cached as JPG on disk, and served via a dedicated endpoint. Frontend displays cover art in album views and player.
- Why it matters: Cover art is the visual identity of a music library — without it, the UI feels broken.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped
- Notes: Fallback placeholder for tracks without embedded art.

### R005 — Browser Audio Playback
- Class: core-capability
- Status: active
- Description: Frontend plays audio streamed from the backend using HTML5 Audio element. Supports play, pause, seek, next, previous, volume control. Global player state persists across page navigation.
- Why it matters: This is the core product — if you can't play music, nothing else matters.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped
- Notes: FLAC natively supported in Chrome, Edge, Firefox. PlayerContext with useReducer.

### R006 — Library Folder Management
- Class: primary-user-loop
- Status: active
- Description: User can add, list, and remove library folders through the UI and API. Adding a folder makes it available for scanning.
- Why it matters: Users need to tell the system where their music is before anything works.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped
- Notes: Settings page in UI.

### R007 — Queue Management
- Class: primary-user-loop
- Status: active
- Description: User can build and manage a playback queue. Clicking a track in any view starts playback and queues the context (album, artist tracks, search results). Shuffle and repeat modes supported.
- Why it matters: Playing a single track at a time would make the player unusable for actual listening sessions.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped
- Notes: Queue persists across navigation. Shuffle randomizes order, repeat loops track/queue.

### R008 — Modern Minimal UI
- Class: launchability
- Status: active
- Description: Frontend provides a clean, modern UI with sidebar navigation, content area, and persistent bottom player bar. Custom theme (not forced dark). Responsive layout. Loading skeletons, error boundaries, empty states.
- Why it matters: The whole point is "my own VLC but prettier" — the UI must look good and feel polished.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped
- Notes: Inspired by Monochrome Music aesthetic. Lucide icons. Tailwind CSS.

### R009 — Docker Compose Deployment
- Class: operability
- Status: active
- Description: Entire stack (backend + frontend) runs via a single `docker-compose up`. Music folder mounted as read-only volume. H2 data persisted in a volume.
- Why it matters: Portability — move to any machine, run one command, works.
- Source: user
- Primary owning slice: none yet
- Supporting slices: none
- Validation: unmapped
- Notes: Frontend can be served from Spring Boot static resources or separate nginx container.

## Deferred

### R010 — Spectrum Visualizer
- Class: differentiator
- Status: deferred
- Description: Real-time audio spectrum visualizer using Web Audio API AnalyserNode, rendered on Canvas/SVG.
- Why it matters: Visual flair that distinguishes this from boring players.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to post-MVP (Phase 2 in original plan).

### R011 — Media Session API Integration
- Class: quality-attribute
- Status: deferred
- Description: Browser Media Session API integration so OS-level media controls (play/pause/next/prev keys) work with the player.
- Why it matters: Without this, keyboard media keys do nothing — feels broken on desktop.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to post-MVP (Phase 2).

### R012 — PWA Support
- Class: quality-attribute
- Status: deferred
- Description: App installable as PWA with manifest.json and service worker. Opens in its own window without browser chrome.
- Why it matters: Makes the web app feel native — own window, own icon, offline UI shell.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to post-MVP (Phase 2).

### R013 — Last.fm / ListenBrainz Scrobbling
- Class: integration
- Status: deferred
- Description: Scrobble completed tracks to Last.fm and/or ListenBrainz for listening history.
- Why it matters: Long-term listening stats and recommendations.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to Phase 3.

### R014 — Subsonic API Compatibility
- Class: integration
- Status: deferred
- Description: Implement core Subsonic/OpenSubsonic API endpoints so existing mobile clients (Symfonium, DSub, etc.) can connect.
- Why it matters: Free mobile client ecosystem without building a mobile app.
- Source: user
- Primary owning slice: none
- Supporting slices: none
- Validation: unmapped
- Notes: Deferred to Phase 3. Only core endpoints needed.

### R015 — On-the-fly Transcoding
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

### R016 — DRM or Third-Party Streaming Integration
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
| R001 | core-capability | active | none yet | none | unmapped |
| R002 | core-capability | active | none yet | none | unmapped |
| R003 | primary-user-loop | active | none yet | none | unmapped |
| R004 | primary-user-loop | active | none yet | none | unmapped |
| R005 | core-capability | active | none yet | none | unmapped |
| R006 | primary-user-loop | active | none yet | none | unmapped |
| R007 | primary-user-loop | active | none yet | none | unmapped |
| R008 | launchability | active | none yet | none | unmapped |
| R009 | operability | active | none yet | none | unmapped |
| R010 | differentiator | deferred | none | none | unmapped |
| R011 | quality-attribute | deferred | none | none | unmapped |
| R012 | quality-attribute | deferred | none | none | unmapped |
| R013 | integration | deferred | none | none | unmapped |
| R014 | integration | deferred | none | none | unmapped |
| R015 | differentiator | deferred | none | none | unmapped |
| R016 | anti-feature | out-of-scope | none | none | n/a |

## Coverage Summary

- Active requirements: 9
- Mapped to slices: 0
- Validated: 0
- Unmapped active requirements: 9
