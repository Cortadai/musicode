---
id: T04
parent: S03
milestone: M007
key_files:
  - musicode-ui/src/pages/SettingsPage.tsx
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-17T19:34:42.803Z
blocker_discovered: false
---

# T04: Scrobble settings UI in SettingsPage with Last.fm and ListenBrainz configuration

**Scrobble settings UI in SettingsPage with Last.fm and ListenBrainz configuration**

## What Happened

Added scrobble configuration section to SettingsPage. ListenBrainz: token input with save/clear. Last.fm: username+password auth flow via auth.getMobileSession, connected/disconnected status display. Calls PUT /api/scrobble/settings. Full test suite passes. Commit: 8927e40.

## Verification

Settings page shows scrobble config. Connect/disconnect flow works. mvn clean verify passes.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn clean verify` | 0 | pass | 45000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/pages/SettingsPage.tsx`
