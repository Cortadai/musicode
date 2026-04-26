# Musicode Server

Spring Boot 3 backend for Musicode. Scans local music folders, reads audio metadata, streams files with HTTP Range support, manages authentication, tracks plays, and integrates with external scrobbling services.

## Tech Stack

| Component | Technology |
|---|---|
| Runtime | Java 21 + Spring Boot 3.4 |
| Security | Spring Security + JWT (JJWT 0.12.6) in HttpOnly cookies |
| Data | Spring Data JPA + H2 (embedded) + Flyway migrations |
| Metadata | JAudioTagger 2.2.5 (FLAC, MP3, OGG, M4A) |
| Docs | SpringDoc OpenAPI 2.8.14 (Swagger UI) |
| Real-time | Server-Sent Events (SseEmitter) |
| Async | Spring `@Async` with configurable thread pool |
| Crypto | AES-256-GCM for scrobble token encryption at rest |
| Logging | Logback with MDC request IDs (JSON in Docker) |
| Coverage | JaCoCo ≥80% enforcement |

## Running

```bash
# Dev mode
mvn spring-boot:run
# http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
# H2 Console: http://localhost:8080/h2-console (dev only)

# Tests (272 tests)
mvn clean verify
```

---

## Architecture

### Request Lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant RF as RequestIdFilter
    participant RL as LoginRateLimitFilter
    participant JF as JwtAuthFilter
    participant SC as SecurityConfig Rules
    participant CT as Controller
    participant SV as Service
    participant DB as H2 Database

    C->>RF: HTTP Request
    RF->>RF: Generate requestId → MDC
    RF->>RL: Pass through
    RL->>RL: Check rate limit (login only)
    RL->>JF: Pass through
    JF->>JF: Extract JWT from cookie
    JF->>JF: Validate signature + expiry
    JF->>JF: Set SecurityContext (username + role)
    JF->>SC: Authenticated request
    SC->>SC: Check endpoint authorization rules
    SC->>CT: Authorized
    CT->>SV: Business logic
    SV->>DB: Query/write
    DB-->>SV: Result
    SV-->>CT: Response DTO
    CT-->>C: JSON response (with requestId header)
```

### Security Filter Chain

```mermaid
graph TD
    Req["Incoming Request"] --> ReqId["RequestIdFilter<br/>Add X-Request-Id to MDC"]
    ReqId --> Rate["LoginRateLimitFilter<br/>50 attempts/60s per IP<br/>(login endpoint only)"]
    Rate --> JWT["JwtAuthFilter<br/>Extract cookie → validate → set SecurityContext"]
    JWT --> Auth{"Authorization Rules"}

    Auth -->|"permitAll"| Public["Public Endpoints<br/>/api/auth/login<br/>/api/auth/refresh<br/>/api/covers/**<br/>/swagger-ui/**<br/>/actuator/health"]
    Auth -->|"ADMIN role"| Admin["Admin Endpoints<br/>POST /api/library/scan<br/>POST /api/library/folders<br/>POST /api/library/cleanup<br/>/api/users/**"]
    Auth -->|"authenticated"| User["Authenticated Endpoints<br/>Everything else<br/>(ADMIN or LISTENER)"]
    Auth -->|"denied"| Err["401 / 403 JSON response"]
```

### Library Scan Process

```mermaid
graph TD
    Start["POST /api/library/scan"] --> Lock{"Already<br/>scanning?"}
    Lock -->|Yes| Abort["Return: scan in progress"]
    Lock -->|No| Init["Reset counters<br/>State → SCANNING"]

    Init --> Count["Phase 1: Count Files<br/>Walk all registered folders<br/>Filter: .flac .mp3 .ogg .m4a .wav"]
    Count --> Process["Phase 2: Process Each File"]

    Process --> Read["Read metadata<br/>(JAudioTagger)"]
    Read --> FindArtist["Find or create Artist<br/>by ALBUM_ARTIST tag<br/>(falls back to track artist)"]
    FindArtist --> FindAlbum["Find or create Album<br/>by (title, albumArtistId)"]
    FindAlbum --> CoverQ{"Cover art<br/>cached?"}
    CoverQ -->|No| ExtractCover["Extract from tags<br/>Save as {albumId}.jpg"]
    CoverQ -->|Yes| SaveTrack["Save Track entity"]
    ExtractCover --> SaveTrack

    SaveTrack --> More{"More files?"}
    More -->|Yes| Process
    More -->|No| Cleanup["Phase 3: Cleanup<br/>Delete orphan albums/artists<br/>(0 tracks, 0 albums)"]

    Cleanup --> Done["State → COMPLETED<br/>Client polls /api/library/scan/status"]

    Process -.->|"On error"| ErrCount["Increment errorFiles<br/>Continue next file"]
```

### Audio Streaming (HTTP Range)

```mermaid
graph TD
    Req["GET /api/stream/{trackId}"] --> Find{"Track<br/>exists?"}
    Find -->|No| E404["404 Not Found"]
    Find -->|Yes| File{"File readable?"}
    File -->|No| E404
    File -->|Yes| Range{"Range header<br/>present?"}

    Range -->|No| Full["200 OK<br/>Content-Type: audio/*<br/>Accept-Ranges: bytes<br/>Stream entire file"]

    Range -->|Yes| Parse["Parse Range header"]
    Parse --> Fmt{"Format?"}
    Fmt -->|"bytes=0-1023"| Closed["Closed range<br/>start=0, end=1023"]
    Fmt -->|"bytes=1024-"| Open["Open-ended<br/>start=1024, end=EOF"]
    Fmt -->|"bytes=-512"| Suffix["Suffix range<br/>last 512 bytes"]

    Closed --> Valid{"start ≤ end<br/>& in bounds?"}
    Open --> Valid
    Suffix --> Valid

    Valid -->|No| E416["416 Range Not Satisfiable<br/>Content-Range: bytes */size"]
    Valid -->|Yes| Partial["206 Partial Content<br/>Content-Range: bytes start-end/size<br/>Stream range via RandomAccessFile<br/>(8KB buffer)"]
```

### Scrobble Pipeline

```mermaid
graph LR
    Play["Play event<br/>(50% threshold)"] --> Async["@Async thread"]
    Async --> LB{"ListenBrainz<br/>configured?"}
    LB -->|Yes| LBSend["Submit listen"]
    LB -->|No| Skip1["Skip"]

    Async --> FM{"Last.fm<br/>configured?"}
    FM -->|Yes| FMSend["Scrobble track"]
    FM -->|No| Skip2["Skip"]

    LBSend --> Retry["Retry with backoff<br/>1s → 2s → 4s<br/>(max 3 attempts)"]
    FMSend --> Retry

    Retry --> Result{"Success?"}
    Result -->|Yes| Done["Logged"]
    Result -->|"Non-retryable"| Fail["Log warning, give up"]
    Result -->|"Max retries"| Fail
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | none | Login, sets HttpOnly cookies. Body: `{ user, accessTokenExpiresIn }` |
| POST | `/api/auth/refresh` | refresh cookie | Rotate access + refresh tokens. Body: `{ user, accessTokenExpiresIn }` |
| POST | `/api/auth/logout` | access cookie | Revoke refresh token |
| GET | `/api/auth/me` | access cookie | Current user info |

### Library (ADMIN only for mutations)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/library/folders` | any | List registered folders |
| POST | `/api/library/folders` | ADMIN | Add folder to scan |
| DELETE | `/api/library/folders/{id}` | ADMIN | Remove folder |
| POST | `/api/library/scan` | ADMIN | Start async library scan |
| GET | `/api/library/scan/status` | any | Scan progress (poll) |
| POST | `/api/library/cleanup` | ADMIN | Remove orphan tracks |

### Library Health (ADMIN)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/library/health/summary` | Issue counts by type |
| GET | `/api/library/health/issues` | Paginated issues filtered by type |

### Browse

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tracks?page,size,sort` | Paginated tracks |
| GET | `/api/tracks/{id}` | Track detail |
| GET | `/api/albums?page,size` | Paginated albums |
| GET | `/api/albums/{id}` | Album with tracks (EntityGraph) |
| GET | `/api/artists?page,size` | Paginated artists |
| GET | `/api/artists/{id}` | Artist with albums (EntityGraph) |
| GET | `/api/search?q=` | Combined search across tracks, albums, artists |
| GET | `/api/stream/{trackId}` | Audio stream (HTTP Range support) |
| GET | `/api/covers/{albumId}` | Cover art JPEG (7-day cache) |

### Lyrics & Waveforms

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/lyrics/{trackId}` | Get lyrics (synced LRC or plain text) |
| POST | `/api/lyrics/{trackId}/retry` | Retry failed lyrics fetch |
| GET | `/api/waveforms/{trackId}` | Waveform peaks for progress bar |

### Users (ADMIN)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| GET | `/api/users/{id}` | User detail |
| POST | `/api/users` | Create user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

### Playback & Stats

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/plays/{trackId}` | Record play event |
| GET | `/api/stats/top-artists?period,limit` | Top artists by play count |
| GET | `/api/stats/top-albums?period,limit` | Top albums by play count |
| GET | `/api/stats/top-tracks?period,limit` | Top tracks by play count |
| GET | `/api/stats/summary?period` | Total plays, listening time, unique counts |
| GET | `/api/stats/history?period` | Plays per day (Recharts-compatible) |

### Scrobble Settings (per user)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/scrobble/settings` | Current scrobble config |
| PUT | `/api/scrobble/settings` | Connect Last.fm or ListenBrainz |
| DELETE | `/api/scrobble/settings/lastfm` | Disconnect Last.fm |
| DELETE | `/api/scrobble/settings/listenbrainz` | Disconnect ListenBrainz |

### Activity Feed

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/activity/stream` | SSE event stream (real-time plays) |
| GET | `/api/activity/recent` | Last 20 play events |

---

## Project Structure

```
src/main/java/com/musicode/
├── config/          Security, AdminSeeder, Async, Jackson, OpenAPI, LastFM, CORS, TokenMigration
├── controller/      16 REST controllers
├── exception/       GlobalExceptionHandler + custom exceptions (BadRequest, Conflict, NotFound)
├── filter/          JwtAuthFilter, LoginRateLimitFilter, RequestIdFilter
├── model/
│   ├── dto/         22 records (LoginRequest, UserResponse, StatsSummary, ActivityEvent, ...)
│   └── entity/      9 JPA entities (Track, Album, Artist, User, RefreshToken, PlaybackEvent,
│                    LibraryFolder, LyricsStatus, Role)
├── repository/      7 Spring Data JPA repositories
├── service/         17 services (Auth, JWT, Scan, Stream, CoverArt, Waveform, Lyrics,
│                    Stats, Scrobble, LastFM, ListenBrainz, Activity, Health, Metadata, ...)
└── util/            CookieUtil, TokenHashUtil, EncryptedStringConverter

src/test/java/       272 tests across 37 test classes
├── config/          AdminSeeder, TokenMigrationRunner
├── controller/      Integration tests for all 16 controllers
└── service/         Unit + WireMock contract tests for all services

src/main/resources/
├── application.yml          Dev config (H2 file, relaxed rate limits)
├── application-docker.yml   Docker profile (secure cookies, env secrets)
├── logback-spring.xml       Colored console (dev) / JSON (docker)
└── db/migration/
    ├── V1__baseline.sql     Schema: users, tracks, albums, artists, tokens, events, folders
    └── V2__add_lyrics_columns.sql
```

---

## Configuration

### Key Properties

| Property | Default | Description |
|---|---|---|
| `musicode.admin.default-password` | `changeme` | Initial admin password |
| `musicode.jwt.secret` | dev key | HS256 signing key (≥32 chars) |
| `musicode.jwt.access-token-expiration-ms` | `900000` | Access token TTL (15 min) |
| `musicode.jwt.refresh-token-expiration-ms` | `604800000` | Refresh token TTL (7 days) |
| `musicode.cookies.secure` | `false` | Cookie Secure flag (true in Docker) |
| `musicode.lastfm.api-key` | _(empty)_ | Last.fm API key |
| `musicode.lastfm.api-secret` | _(empty)_ | Last.fm API secret |
| `musicode.encryption.token-key` | _(env)_ | AES-256-GCM key for scrobble tokens |
| `musicode.security.login-rate-limit.max-attempts` | `50` | Login attempts per window |
| `musicode.security.login-rate-limit.window-seconds` | `60` | Rate limit window |
| `musicode.scrobble.retry-delay-ms` | `1000` | Base delay for exponential backoff |

Docker profile (`application-docker.yml`) overrides: `cookies.secure=true`, reads secrets from environment variables.

---

## Error Handling

All errors return consistent JSON via `@ControllerAdvice`:

```json
{
  "status": 404,
  "error": "Album not found with id: 42",
  "path": "/api/albums/42",
  "timestamp": "2026-03-31T10:00:00Z"
}
```

## Logging

| Mode | Format | Features |
|---|---|---|
| **Dev** | Colored console | `[requestId]` correlation, SQL formatting |
| **Docker** | JSON structured | Aggregation-ready, MDC fields included |

Every request gets a unique `X-Request-Id` (via `RequestIdFilter`) propagated through MDC for end-to-end tracing.

---

## Tests

```bash
mvn clean verify   # Runs all 272 tests + JaCoCo coverage check
```

| Category | Count | Description |
|---|---|---|
| **Controller integration** | ~110 | `@WebMvcTest` with `@WithMockUser`, real filter chain |
| **Service unit** | ~120 | Mockito-based, logic isolation |
| **Contract (WireMock)** | ~40 | Last.fm + ListenBrainz wire format validation |
| **Config** | ~4 | AdminSeeder, TokenMigrationRunner |

WireMock contract tests validate actual HTTP request bodies, signatures, and headers — catching wire format bugs that Mockito tests can't see.
