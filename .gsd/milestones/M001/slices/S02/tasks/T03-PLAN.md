---
estimated_steps: 7
estimated_files: 5
skills_used: []
---

# T03: Global search endpoint

Create search endpoint that queries tracks, albums, and artists by a search term. Returns combined results.

Steps:
1. Add search query methods to repositories (LIKE queries on title/name)
2. Create SearchController with GET /api/search?q=...
3. Return structured response with tracks, albums, artists arrays
4. Handle empty query and no results
5. Test with curl

## Inputs

- `musicode-server/src/main/java/com/musicode/repository/TrackRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/AlbumRepository.java`
- `musicode-server/src/main/java/com/musicode/repository/ArtistRepository.java`

## Expected Output

- `musicode-server/src/main/java/com/musicode/controller/SearchController.java`
- `musicode-server/src/main/java/com/musicode/model/dto/SearchResults.java`

## Verification

curl 'http://localhost:8080/api/search?q=dark' returns JSON with matching tracks, albums, and artists; empty query returns empty arrays
