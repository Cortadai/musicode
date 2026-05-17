# M029: Per-Artist Visibility

## Vision
Allow users to hide specific artists from the library view. Hidden artists (and their albums/tracks) don't appear in browsing but remain in the DB and can be restored from Settings.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Backend: hidden flag + filtered queries | low | — | ⬜ | GET /api/artists excludes hidden artists; PUT /api/artists/{id}/hidden toggles; GET /api/artists/hidden lists hidden ones |
| S02 | Frontend: hide action + settings management | low | S01 | ⬜ | User clicks hide on artist detail → artist disappears from lists; Settings shows hidden artists with restore button |
