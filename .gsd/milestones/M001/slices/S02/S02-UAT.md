# S02: Browse API + Cover Art — UAT

**Milestone:** M001
**Written:** 2026-03-30T09:07:20.039Z

## UAT: S02 — Browse API + Cover Art\n\n### Test 1: Albums Browse\n1. GET `http://localhost:8080/api/albums?page=0&size=10`\n2. **Expected:** Paginated JSON with album objects (title, year, hasCoverArt, artist)\n\n### Test 2: Album Detail\n1. GET `http://localhost:8080/api/albums/1`\n2. **Expected:** Album with tracks array (17 tracks, ordered by disc/track number)\n\n### Test 3: Artists Browse\n1. GET `http://localhost:8080/api/artists`\n2. **Expected:** Paginated JSON with artist objects\n\n### Test 4: Artist Detail\n1. GET `http://localhost:8080/api/artists/1`\n2. **Expected:** Artist with albums array\n\n### Test 5: Cover Art\n1. GET `http://localhost:8080/api/covers/1`\n2. **Expected:** image/jpeg response with Cache-Control: max-age=604800\n\n### Test 6: Search\n1. GET `http://localhost:8080/api/search?q=dark`\n2. **Expected:** JSON with tracks, albums, artists arrays containing matches"
