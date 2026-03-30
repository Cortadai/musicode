---
estimated_steps: 6
estimated_files: 1
skills_used: []
---

# T02: Cover art serving endpoint

Create endpoint to serve album cover art images. Uses CoverArtService to locate the file, returns image/jpeg with caching headers.

Steps:
1. Create CoverArtController with GET /api/covers/{albumId}
2. Return image/jpeg with Cache-Control headers (covers don't change often)
3. Return 404 if no cover art exists
4. Test with curl and browser

## Inputs

- `musicode-server/src/main/java/com/musicode/service/CoverArtService.java`

## Expected Output

- `musicode-server/src/main/java/com/musicode/controller/CoverArtController.java`

## Verification

curl -o /dev/null -w '%{http_code} %{content_type}' http://localhost:8080/api/covers/1 returns 200 image/jpeg; curl for non-existent album returns 404
