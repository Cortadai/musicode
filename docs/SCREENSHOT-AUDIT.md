# Screenshot Audit — Sonance

Generated: 2026-05-16 | For: Root README.md

---

## Existing Screenshots (8 content + 3 logos)

| File | Used in README | Description |
|---|---|---|
| `sonance-logo.png` | Header | App logo (120px) |
| `sonance-logo-512.png` | — | High-res logo (unused in README) |
| `sonance-logo.svg` | — | Vector logo (unused in README) |
| `sonance-social-preview.png` | — | GitHub social preview card |
| `sonance-hero.jpg` | Hero section | Album grid with player bar and activity feed |
| `sonance-now-playing.jpg` | Visualizer Modes | Vinyl visualizer with dynamic colors |
| `sonance-lyrics.jpg` | Synced Lyrics | Now Playing with synced lyrics and waveform seekbar |
| `sonance-cassette.png` | Cassette Deck | Classic theme with VU meters and animated reels |
| `sonance-health.png` | More Screenshots | Library Health dashboard |
| `sonance-mobile-library.jpg` | Responsive Layout | Mobile album grid with compact sidebar |
| `sonance-mobile-player.png` | Responsive Layout | Mobile Now Playing with vinyl visualizer |

---

## Missing Screenshots (placeholders in README)

These are HTML comments in README.md that reserve space for future images.

### Priority 1 — Feature sections (visible mid-page)

| # | Placeholder | Suggested filename | What to capture |
|---|---|---|---|
| 1 | Playlist detail page | `sonance-playlists.jpg` | A playlist open with 8+ tracks, showing drag handles for reorder. Sidebar should show the playlist list. Use Evolved shell for full sidebar visibility. |
| 2 | Queue panel slide-out | `sonance-queue.jpg` | Player bar at bottom playing a track, queue panel slid out showing 5-6 upcoming tracks. Capture with a queue that has variety (different albums). |
| 3 | Home dashboard | `sonance-home.jpg` | Home page with recently played grid, top artists widget, and quick stats cards visible. Ensure some data is populated (not first-run empty state). |
| 4 | Stats page | `sonance-stats.jpg` | Stats page showing summary cards (total plays, listening time), the daily plays bar chart with at least 2 weeks of data, and one of the top lists (artists or tracks). |

### Priority 2 — More Screenshots gallery (bottom of page)

| # | Placeholder | Suggested filename | What to capture |
|---|---|---|---|
| 5 | Album detail page | `sonance-album-detail.jpg` | An album with 10+ tracks, showing cover art, track list with duration, and the player bar at bottom playing a track from that album. |
| 6 | Artist detail page | `sonance-artist.jpg` | An artist with 3+ albums showing the discography grid. Include album covers and release metadata. |
| 7 | Search results | `sonance-search.jpg` | Search with a query that returns results across all three categories (tracks, albums, artists). Show the tabbed/sectioned results. |
| 8 | Settings page | `sonance-settings.jpg` | Settings page with scrobble config section visible AND the EQ popover open simultaneously (may require composite/overlay edit). Alternative: just the settings page with scrobble tokens configured. |
| 9 | Login page | `sonance-login.jpg` | Login form centered with the tsParticles animated background visible. Dark theme preferred for contrast. |

---

## Recommended Additional Screenshots (not currently placeholders)

These would strengthen the README if added:

| # | Suggested filename | Section to add it | What to capture |
|---|---|---|---|
| 10 | `sonance-analyzer-deck.jpg` | Analyzer Deck | Panel showing 4-6 scopes active: spectrum analyzer, vectorscope, spectrogram, and oscilloscope at minimum. Resize handles visible. Music playing with active FFT data. |
| 11 | `sonance-eq.jpg` | Parametric EQ | EQ panel open with a custom curve (not flat). Show frequency nodes on the graph with gain adjustments visible. |
| 12 | `sonance-shells.jpg` | UI System: Shells & Palettes | Side-by-side comparison of Evolved, Nova, and Minimal shells on the same page (album grid). Can be a composite of 3 screenshots. Width: 800px. |
| 13 | `sonance-desktop-app.jpg` | Desktop App (Quick Start) | Electron window with system tray icon visible. Show the app in windowed mode with the title bar and tray context menu open. |

---

## Capture Recommendations

- **Resolution:** 1920x1080 desktop, crop to content (target ~800px wide for README display)
- **Theme/Palette:** Use Indigo (default) for consistency across all screenshots
- **Shell:** Evolved for most (shows full sidebar), except responsive shots
- **Dynamic colors:** Have music playing so the player bar shows album-extracted colors
- **Data:** Populate the library with 50+ albums, 500+ tracks before capturing. Need scrobble history for stats page.
- **Browser:** Chrome DevTools device toolbar at exactly 1280px wide for consistent framing (or Electron window)
- **Format:** JPEG for photos/screenshots (quality 85), PNG only for UI with sharp text/transparency

---

## Summary

| Category | Count |
|---|---|
| Existing (usable) | 8 |
| Missing (placeholders) | 9 |
| Recommended additions | 4 |
| **Total needed** | **13** |
