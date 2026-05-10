# M025: Playlists

## Vision
Users can create, manage, and play playlists. Favorites appear as a pseudo-playlist. Tracks can be added to playlists from any track list. Playlist order is user-controlled.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Backend — model, migration, API, tests | low | — | ⬜ | Playlist CRUD endpoints respond correctly via Swagger/curl — create, list, detail, rename, delete, add/remove tracks, reorder |
| S02 | Frontend — playlist browser, detail view, API client | medium | S01 | ⬜ | User can navigate to playlists view, see list of playlists as cards, click into a playlist, see its tracks, and play from the playlist |
| S03 | Integration — context menu, sidebar, favorites pseudo-playlist | medium | S01, S02 | ⬜ | User can right-click any track and add to playlist. Sidebar shows playlist section in all shells. Favorites appear as first playlist entry. |
| S04 | Reorder and polish — drag/arrows, empty states, confirmations | low | S02 | ⬜ | User can reorder tracks in a playlist via drag or arrow buttons. Empty playlist shows helpful state. Delete playlist asks for confirmation. |
