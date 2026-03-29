# Musicode - Plan de Arquitectura

## Contexto
Reproductor de música personal web con dos módulos: **Local Player** (MVP, reproducir FLAC locales) y **Stream Player** (futuro, streaming vía APIs de terceros tipo TIDAL). Alternativa moderna a VLC con UI propia y bonita.

## Stack
- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Spring Boot 3 + Java 21 + Gradle (Kotlin DSL)
- **Base de datos:** H2 (file mode, zero config, embebida)
- **Metadata FLAC:** JAudioTagger 3.x
- **Audio en browser:** HTML5 Audio element (FLAC nativo en Chrome/Edge/Firefox)

## Estructura del Proyecto (Monorepo)

```
musicode/
├── musicode-server/                    (Spring Boot)
│   └── src/main/java/com/musicode/
│       ├── config/                     WebConfig, LibraryConfig, AsyncConfig
│       ├── model/entity/               Track, Album, Artist, LibraryFolder
│       ├── model/dto/                  DTOs para API
│       ├── repository/                 Spring Data JPA repos
│       ├── service/                    MetadataService, LibraryScanService,
│       │                               AudioStreamService, CoverArtService
│       ├── controller/                 REST controllers
│       └── exception/                  GlobalExceptionHandler
│
├── musicode-ui/                        (React + Vite)
│   └── src/
│       ├── api/                        Axios client + funciones por recurso
│       ├── types/                      Interfaces TypeScript
│       ├── hooks/                      usePlayer, useQueue, useSearch
│       ├── context/                    PlayerContext (useReducer)
│       ├── components/
│       │   ├── layout/                 AppShell, Sidebar, TopBar
│       │   ├── player/                 PlayerBar, ProgressBar, VolumeControl
│       │   ├── library/                TrackList, AlbumGrid, AlbumCard
│       │   └── common/                 CoverArt, SearchInput, LoadingSpinner
│       ├── pages/                      Home, Tracks, Albums, Artists, Settings, Search
│       └── styles/                     theme.css (paleta custom, NO full dark)
│
└── Mora-dl/                            (referencia, ya clonado)
```

## Entidades JPA

**Track:** id, title, trackNumber, discNumber, duration, filePath (UNIQUE), fileSize, bitRate, sampleRate, bitsPerSample, year, genre, isrc, copyright, bpm → ManyToOne Album, ManyToOne Artist

**Album:** id, title, year, coverArtPath, hasCoverArt → ManyToOne Artist, OneToMany Tracks. UNIQUE(title, artist_id)

**Artist:** id, name (UNIQUE) → OneToMany Albums, OneToMany Tracks

**LibraryFolder:** id, path (UNIQUE), lastScannedAt, trackCount

## API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/library/folders | Añadir carpeta |
| GET | /api/library/folders | Listar carpetas |
| DELETE | /api/library/folders/{id} | Eliminar carpeta |
| POST | /api/library/scan | Lanzar escaneo async |
| GET | /api/library/scan/status | Estado del escaneo |
| GET | /api/tracks?page,size,sort,search,artistId,albumId | Tracks paginados |
| GET | /api/tracks/{id} | Detalle track |
| GET | /api/albums?page,size,search,artistId | Álbumes paginados |
| GET | /api/albums/{id} | Álbum + sus tracks |
| GET | /api/artists?page,size,search | Artistas paginados |
| GET | /api/artists/{id} | Artista + álbumes + tracks |
| GET | /api/stream/{trackId} | Stream FLAC con HTTP Range (206) |
| GET | /api/covers/{albumId} | Cover art cacheada |
| GET | /api/search?q= | Búsqueda combinada |

## Piezas técnicas clave

1. **Audio Streaming con Range:** FLAC son 30-80MB. Spring `ResourceRegion` sirve contenido parcial (206 Partial Content) para seeking instantáneo.
2. **Cover Art Cache:** Se extraen las portadas durante el escaneo → `./data/covers/{albumId}.jpg`. Se sirven cacheadas.
3. **Escaneo Async:** `@Async` + `@EnableAsync`. Recorre carpetas, filtra .flac, lee metadata con JAudioTagger, upsert en DB.
4. **Player React:** `useReducer` en `PlayerContext` para estado global. `usePlayer` hook maneja la instancia `HTMLAudioElement` + eventos.
5. **Server State:** TanStack Query para datos de librería (cache, paginación, refetch).

## Fases de implementación

### Fase 1 — Scaffolding
- Generar proyecto Spring Boot (start.spring.io: Web, JPA, H2, DevTools, Validation)
- Crear musicode-ui con `npm create vite@latest -- --template react-ts`
- Instalar deps: tailwindcss, react-router, @tanstack/react-query, axios, lucide-react
- CORS config para dev (localhost:5173 → localhost:8080)
- Verificar que ambos arrancan

### Fase 2 — Metadata + Entidades
- JPA entities + repositories
- MetadataService con JAudioTagger: leer tags FLAC + extraer cover art
- Test con un FLAC real

### Fase 3 — Escaneo de Librería
- LibraryScanService async: walk dirs → filter .flac → read metadata → upsert
- Dedup artista/álbum por nombre
- Controller + endpoints de folders y scan

### Fase 4 — API de Browse
- DTOs + mappers
- Controllers de tracks, albums, artists, search
- Paginación + filtros + búsqueda

### Fase 5 — Audio Streaming
- AudioStreamService: HTTP Range con ResourceRegion
- CoverArtService: extracción + cache + servir
- StreamController + CoverArtController

### Fase 6 — UI Shell
- Theme CSS custom (paleta propia, no full dark)
- AppShell: sidebar + content + player bar fijo
- React Router con todas las rutas
- API client layer + TypeScript interfaces

### Fase 7 — Páginas de Librería
- SettingsPage: gestión de carpetas + scan
- TracksPage, AlbumsPage, AlbumDetailPage
- ArtistsPage, ArtistDetailPage
- SearchResultsPage

### Fase 8 — Player
- PlayerContext + useReducer
- usePlayer hook: HTMLAudioElement + eventos
- PlayerBar: play/pause, prev/next, progress, volume, now playing
- Queue management, click-to-play

### Fase 9 — Polish
- Loading skeletons, error boundaries, empty states
- Keyboard shortcuts (Space, flechas)
- Responsive, placeholder covers

## Preparación para Stream Module (futuro)

La arquitectura ya acomoda el módulo de streaming sin reestructurar:
- `PlayerSource` enum (LOCAL / STREAM) en los tracks
- Campos de Track alineados con el modelo de Mora-dl (audioQuality, isrc, etc.)
- PlayerContext es agnóstico al origen: solo necesita una URL de stream
- Toggle en sidebar para cambiar entre módulos
- Extensión backend: `StreamProviderService` + controllers dedicados

## Dependencias clave

**Backend:** spring-boot-starter-web, spring-boot-starter-data-jpa, h2, jaudiotagger:3.0.1, lombok, mapstruct, devtools

**Frontend:** react, react-dom, react-router, @tanstack/react-query, axios, tailwindcss, lucide-react, clsx, typescript

## Verificación
1. Backend arranca en :8080, frontend en :5173
2. POST a /api/library/folders con ruta de FLACs → 200 OK
3. POST a /api/library/scan → escaneo completa
4. GET /api/tracks → devuelve tracks con metadata
5. GET /api/stream/{id} con header Range → 206 + audio suena
6. UI: navegar librería, click en track → suena por el PlayerBar
