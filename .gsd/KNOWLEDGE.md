# Project Knowledge

Append-only register of project-specific rules, patterns, and lessons learned.
Agents read this before every unit. Add entries when you discover something worth remembering.

## Rules

| # | Scope | Rule | Why | Added |
|---|-------|------|-----|-------|
| 1 | server | Always kill all `java.exe` processes before starting Spring Boot | H2 file-mode DB locks the `.mv.db` file exclusively. Zombie Java processes from crashed bg_shell instances hold the lock and prevent restart. Use `wmic process where "name='java.exe'" delete` on Windows — `taskkill /F` sometimes fails silently. | S02 |
| 2 | server | Never set `spring.jpa.open-in-view: true` | We use jackson-datatype-hibernate6 instead. Lazy proxies serialize as `null` in list endpoints, EntityGraph loads collections for detail endpoints. open-in-view masks real session issues. | S02 |
| 3 | entities | Artist collections must be `Set`, not `List` | Hibernate throws `MultipleBagFetchException` when fetching two `List` (bag) collections simultaneously via EntityGraph. `Set` avoids this. Album.tracks can stay as `List` since it's the only collection on Album. | S02 |

## Patterns

| # | Pattern | Where | Notes |
|---|---------|-------|-------|
| 1 | EntityGraph for detail, Hibernate6Module for lists | AlbumRepository, ArtistRepository, JacksonConfig | Detail endpoints use `@EntityGraph(attributePaths=...)` on custom finder methods (`findWithTracksById`). List endpoints let lazy collections serialize as `null` via Hibernate6Module. |
| 2 | HTTP Range streaming with RandomAccessFile | AudioStreamService | Parse `Range: bytes=start-end` header, return 206 with `Content-Range`. Supports open-ended (`bytes=1024-`), suffix (`bytes=-512`), and explicit ranges. Single-range only — browsers don't use multi-range for audio. |
| 3 | Cover art cached as `{albumId}.jpg` on disk | CoverArtService, CoverArtController | Extracted during scan, served via `/api/covers/{albumId}` with `Cache-Control: max-age=604800` (7 days). Skip extraction if file already exists. |
| 4 | Content-Type from file extension | AudioStreamService.resolveContentType | `.flac`→`audio/flac`, `.mp3`→`audio/mpeg`, `.ogg`→`audio/ogg`, `.m4a`→`audio/mp4`, `.wav`→`audio/wav`. |

## Lessons Learned

| # | What Happened | Root Cause | Fix | Scope |
|---|--------------|------------|-----|-------|
| 1 | `LazyInitializationException` when serializing Album list endpoint | `Album.tracks` is lazy (default for `@OneToMany`), Jackson tries to access it outside Hibernate session, `open-in-view` is disabled | Added `jackson-datatype-hibernate6` with `Hibernate6Module` — writes `null` for uninitialized proxies instead of throwing | S02 |
| 2 | `MultipleBagFetchException` on Artist detail with EntityGraph `{albums, tracks}` | Hibernate cannot simultaneously fetch two `List` (bag) typed collections in a single query | Changed `Artist.albums` and `Artist.tracks` from `List` to `Set` | S02 |
| 3 | H2 database lock prevents Spring Boot startup after unclean shutdown | H2 file-mode acquires exclusive lock on `.mv.db`. Crashed/killed Java processes don't release it. `taskkill /F` on Windows sometimes doesn't kill the process. | Use `wmic process where "name='java.exe'" delete` to force kill, then retry. The `.lock.db` file is a symptom, not the cause — the `.mv.db` file itself is locked by the OS. | S01-S02 |
| 4 | JAudioTagger 3.x not available in Maven Central | The artifact `net.jthink:jaudiotagger:3.x` doesn't exist in standard repos | Use `jaudiotagger:2.2.5` — works fine for FLAC/MP3/OGG metadata reading | S01 |
