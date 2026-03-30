---
estimated_steps: 6
estimated_files: 3
skills_used: []
---

# T04: Search page + Settings page with folder management

Implement Search page and Settings page. Search queries /api/search?q= and shows results grouped by tracks/albums/artists. Settings manages library folders (add/remove) and triggers scan.

Steps:
1. SearchPage: search input, fetch /api/search?q=, display grouped results
2. SettingsPage: fetch /api/library/folders, add folder form, delete button, scan trigger with status polling
3. Wire TopBar search input to navigate to search page
4. Verify search works with real data, folder management works

## Inputs

- `musicode-ui/src/api/search.ts`
- `musicode-ui/src/api/library.ts`

## Expected Output

- `musicode-ui/src/pages/SearchPage.tsx`
- `musicode-ui/src/pages/SettingsPage.tsx`

## Verification

Search for 'dark' — results show matching tracks. Settings page shows folders, can add new folder path, trigger scan, see scan complete.
