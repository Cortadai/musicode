---
estimated_steps: 7
estimated_files: 6
skills_used: []
---

# T01: Paginated browse endpoints — albums, artists, tracks

Upgrade TrackController to support pagination and sorting. Create AlbumController with paginated album list and album detail (with tracks). Create ArtistController with paginated artist list and artist detail (with albums). Add necessary repository query methods.

Steps:
1. Add Spring Data Pageable support to repositories
2. Upgrade TrackController: GET /api/tracks with page, size, sort params
3. Create AlbumController: GET /api/albums (paginated), GET /api/albums/{id} (with tracks)
4. Create ArtistController: GET /api/artists (paginated), GET /api/artists/{id} (with albums)
5. Test all endpoints with curl

## Inputs

- `musicode-server/src/main/java/com/musicode/model/entity/Track.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Album.java`
- `musicode-server/src/main/java/com/musicode/model/entity/Artist.java`

## Expected Output

- `musicode-server/src/main/java/com/musicode/controller/AlbumController.java`
- `musicode-server/src/main/java/com/musicode/controller/ArtistController.java`

## Verification

curl http://localhost:8080/api/albums?page=0&size=10 returns paginated JSON; curl http://localhost:8080/api/albums/1 returns album with tracks array; curl http://localhost:8080/api/artists returns artist list; curl http://localhost:8080/api/tracks?sort=title,asc returns sorted tracks
