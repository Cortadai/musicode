---
estimated_steps: 7
estimated_files: 5
skills_used: []
---

# T01: UI polish — fix Unknown artist, infinite scroll, loading/empty states

Fix 'Unknown' artist in album detail tracks and add infinite scroll to TracksPage. Add loading spinners and empty states to all pages.

Steps:
1. Fix album detail: backend returns tracks without artist due to @JsonIgnoreProperties — add artist info to tracks in album detail response
2. TracksPage: implement infinite scroll with TanStack Query useInfiniteQuery, load 30 at a time
3. Add loading spinner component
4. Add empty state messages to all pages
5. Verify in browser

## Inputs

- `musicode-ui/src/pages/TracksPage.tsx`
- `musicode-server/src/main/java/com/musicode/model/entity/Album.java`

## Expected Output

- `musicode-ui/src/components/common/Spinner.tsx`

## Verification

Album detail shows artist names on tracks. Tracks page loads incrementally on scroll. Empty states shown when no data.
