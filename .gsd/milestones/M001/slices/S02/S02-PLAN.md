# S02: Browse API + Cover Art

**Goal:** Complete REST API for browsing the library: paginated tracks/albums/artists, album and artist detail, cover art serving, and global search.
**Demo:** After this: API calls via browser/curl return paginated tracks, albums with cover art URLs, artists, and search results.

## Tasks
- [x] **T01: Paginated browse endpoints for tracks, albums (with detail), and artists (with detail).** — Upgrade TrackController to support pagination and sorting. Create AlbumController with paginated album list and album detail (with tracks). Create ArtistController with paginated artist list and artist detail (with albums). Add necessary repository query methods.

Steps:
1. Add Spring Data Pageable support to repositories
2. Upgrade TrackController: GET /api/tracks with page, size, sort params
3. Create AlbumController: GET /api/albums (paginated), GET /api/albums/{id} (with tracks)
4. Create ArtistController: GET /api/artists (paginated), GET /api/artists/{id} (with albums)
5. Test all endpoints with curl
  - Estimate: 1h
  - Files: musicode-server/src/main/java/com/musicode/controller/TrackController.java, musicode-server/src/main/java/com/musicode/controller/AlbumController.java, musicode-server/src/main/java/com/musicode/controller/ArtistController.java, musicode-server/src/main/java/com/musicode/repository/TrackRepository.java, musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java, musicode-server/src/main/java/com/musicode/repository/ArtistRepository.java
  - Verify: curl http://localhost:8080/api/albums?page=0&size=10 returns paginated JSON; curl http://localhost:8080/api/albums/1 returns album with tracks array; curl http://localhost:8080/api/artists returns artist list; curl http://localhost:8080/api/tracks?sort=title,asc returns sorted tracks
- [x] **T02: Cover art endpoint serves album JPGs with 7-day cache control.** — Create endpoint to serve album cover art images. Uses CoverArtService to locate the file, returns image/jpeg with caching headers.

Steps:
1. Create CoverArtController with GET /api/covers/{albumId}
2. Return image/jpeg with Cache-Control headers (covers don't change often)
3. Return 404 if no cover art exists
4. Test with curl and browser
  - Estimate: 30m
  - Files: musicode-server/src/main/java/com/musicode/controller/CoverArtController.java
  - Verify: curl -o /dev/null -w '%{http_code} %{content_type}' http://localhost:8080/api/covers/1 returns 200 image/jpeg; curl for non-existent album returns 404
- [x] **T03: Global search endpoint queries tracks, albums, and artists by title/name with LIKE.** — Create search endpoint that queries tracks, albums, and artists by a search term. Returns combined results.

Steps:
1. Add search query methods to repositories (LIKE queries on title/name)
2. Create SearchController with GET /api/search?q=...
3. Return structured response with tracks, albums, artists arrays
4. Handle empty query and no results
5. Test with curl
  - Estimate: 45m
  - Files: musicode-server/src/main/java/com/musicode/controller/SearchController.java, musicode-server/src/main/java/com/musicode/model/dto/SearchResults.java, musicode-server/src/main/java/com/musicode/repository/TrackRepository.java, musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java, musicode-server/src/main/java/com/musicode/repository/ArtistRepository.java
  - Verify: curl 'http://localhost:8080/api/search?q=dark' returns JSON with matching tracks, albums, and artists; empty query returns empty arrays
