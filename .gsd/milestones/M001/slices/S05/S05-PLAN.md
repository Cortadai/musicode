# S05: Polish + Docker Compose

**Goal:** Production-ready polish: infinite scroll for large libraries, fix 'Unknown' artist in album tracks, loading/empty states, Docker Compose packaging.
**Demo:** After this: docker-compose up on a clean Windows 11 machine → open localhost → full app works. UI has loading states, error handling, and empty states. Keyboard shortcuts work.

## Tasks
- [x] **T01: Fixed Unknown artist bug, added infinite scroll, loading spinners, and empty states.** — Fix 'Unknown' artist in album detail tracks and add infinite scroll to TracksPage. Add loading spinners and empty states to all pages.

Steps:
1. Fix album detail: backend returns tracks without artist due to @JsonIgnoreProperties — add artist info to tracks in album detail response
2. TracksPage: implement infinite scroll with TanStack Query useInfiniteQuery, load 30 at a time
3. Add loading spinner component
4. Add empty state messages to all pages
5. Verify in browser
  - Estimate: 1h
  - Files: musicode-server/src/main/java/com/musicode/model/entity/Album.java, musicode-ui/src/pages/TracksPage.tsx, musicode-ui/src/pages/AlbumsPage.tsx, musicode-ui/src/pages/ArtistsPage.tsx, musicode-ui/src/components/common/Spinner.tsx
  - Verify: Album detail shows artist names on tracks. Tracks page loads incrementally on scroll. Empty states shown when no data.
- [x] **T02: Docker Compose setup with multi-stage Dockerfiles and nginx API proxy.** — Create Dockerfiles for backend and frontend, and docker-compose.yml that mounts the music folder and starts everything.

Steps:
1. Create musicode-server/Dockerfile (multi-stage: Maven build + JRE runtime)
2. Create musicode-ui/Dockerfile (multi-stage: npm build + nginx)
3. Create nginx.conf for frontend (SPA routing + API proxy)
4. Create docker-compose.yml with both services + volume mount
5. Create .dockerignore files
6. Test docker-compose up
  - Estimate: 1h
  - Files: docker-compose.yml, musicode-server/Dockerfile, musicode-ui/Dockerfile, musicode-ui/nginx.conf, musicode-server/.dockerignore, musicode-ui/.dockerignore
  - Verify: docker-compose up builds and starts both services. Open localhost:3000 → full app works.
