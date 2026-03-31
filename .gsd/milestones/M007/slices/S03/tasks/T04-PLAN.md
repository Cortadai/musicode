---
estimated_steps: 7
estimated_files: 2
skills_used: []
---

# T04: Settings UI + tests + verification

1. Add scrobble section to frontend Settings page (or create a new ScrobbleSettings component)
2. ListenBrainz: text input for token, save/clear buttons
3. Last.fm: username + password fields for initial auth, connected/disconnected status
4. Call PUT /api/users/me/scrobble to save config
5. Show connection status (connected/disconnected)
6. Run full test suite: mvn clean verify, npm test:coverage, npx playwright test
7. Commit

## Inputs

- `Scrobble API endpoints`
- `SettingsPage`

## Expected Output

- `Updated SettingsPage or new ScrobbleSettings component`
- `All tests passing`

## Verification

mvn clean verify passes. npx playwright test passes. Settings page shows scrobble config.
