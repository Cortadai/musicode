# M012: Structural Cleanup & CI

## Vision
Reduce complexity in the most critical frontend file (usePlayer), establish code-splitting patterns for sustainable bundle growth, and add automated test verification on every push via GitHub Actions.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | high | — | ✅ | Player works identically — play, pause, next, prev, seek, shuffle, scrobble at 50%, media session controls on lock screen. usePlayer.ts is ~120 LOC orchestrator. |
| S02 | S02 | low | — | ✅ | Network tab shows chunked loading on first navigation to Settings/Search/etc. Non-admin user redirected away from /settings. |
| S03 | S03 | low | — | ✅ | Push to main triggers CI. GitHub shows green check with backend (mvn verify) and frontend (vitest + build) jobs. |
