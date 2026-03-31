# Musicode Server

Spring Boot 3 backend for Musicode. Scans local music folders, reads metadata, streams audio with HTTP Range support, and manages authentication.

## Tech Stack

- Java 21 + Spring Boot 3.4
- Spring Security + JWT (JJWT 0.12.6)
- Spring Data JPA + H2 (embedded)
- SpringDoc OpenAPI 2.8.14 (Swagger UI)
- Recharts-compatible stats API
- JAudioTagger 2.2.5 (audio metadata)
- Server-Sent Events (SseEmitter)
- Logback with MDC request IDs
- JaCoCo ≥80% coverage enforcement

## Running

```bash
# Dev mode
mvn spring-boot:run
# http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html

# Tests
mvn clean verify
```

## API

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | none | Login, returns cookies |
| POST | `/api/auth/refresh` | refresh cookie | Rotate tokens |
| POST | `/api/auth/logout` | access cookie | Revoke refresh token |
| GET | `/api/auth/me` | access cookie | Current user info |

### Library (ADMIN only for mutations)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/library/folders` | any | List folders |
| POST | `/api/library/folders` | ADMIN | Add folder |
| DELETE | `/api/library/folders/{id}` | ADMIN | Remove folder |
| POST | `/api/library/scan` | ADMIN | Start scan |
| GET | `/api/library/scan/status` | any | Scan progress |
| POST | `/api/library/cleanup` | ADMIN | Remove orphan tracks |

### Browse (any authenticated user)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tracks?page,size,sort` | Paginated tracks |
| GET | `/api/tracks/{id}` | Track detail |
| GET | `/api/albums?page,size` | Paginated albums |
| GET | `/api/albums/{id}` | Album with tracks |
| GET | `/api/artists?page,size` | Paginated artists |
| GET | `/api/artists/{id}` | Artist with albums |
| GET | `/api/search?q=` | Combined search |
| GET | `/api/stream/{trackId}` | Audio stream (Range support) |
| GET | `/api/covers/{albumId}` | Cover art JPEG |

### Users (ADMIN only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| GET | `/api/users/{id}` | User detail |
| POST | `/api/users` | Create user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

### Playback & Stats (any authenticated user)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/plays/{trackId}` | Record a play event |
| GET | `/api/stats/top-artists?period,limit` | Top artists by play count |
| GET | `/api/stats/top-albums?period,limit` | Top albums by play count |
| GET | `/api/stats/top-tracks?period,limit` | Top tracks by play count |
| GET | `/api/stats/summary?period` | Total plays, listening time, unique artists/albums |
| GET | `/api/stats/history?period` | Plays per day for charting |

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

## Configuration

See `src/main/resources/application.yml` for dev defaults.

Docker profile: `src/main/resources/application-docker.yml` — activates secure cookies and reads secrets from environment variables.

### Key Properties

| Property | Default | Description |
|---|---|---|
| `musicode.admin.default-password` | `changeme` | Initial admin password |
| `musicode.jwt.secret` | dev key | HS256 signing key (≥32 chars) |
| `musicode.jwt.access-token-expiration-ms` | `900000` | Access token TTL (15 min) |
| `musicode.jwt.refresh-token-expiration-ms` | `604800000` | Refresh token TTL (7 days) |
| `musicode.cookies.secure` | `false` | Cookie Secure flag (true in docker) |
| `musicode.lastfm.api-key` | _(empty)_ | Last.fm API key for scrobbling |
| `musicode.lastfm.api-secret` | _(empty)_ | Last.fm API secret for scrobbling |

## Project Structure

```
src/main/java/com/musicode/
├── config/          SecurityConfig, AdminSeeder, AsyncConfig, JacksonConfig, OpenApiConfig, LastfmConfig
├── controller/      REST controllers (Auth, User, Album, Artist, Track, Play, Stats, Scrobble, Activity)
├── exception/       GlobalExceptionHandler, custom exceptions
├── filter/          JwtAuthFilter, RequestIdFilter
├── model/
│   ├── dto/         Records: LoginRequest, UserResponse, StatsSummary, ActivityEvent, etc.
│   └── entity/      JPA entities: Track, Album, Artist, User, RefreshToken, PlaybackEvent
├── repository/      Spring Data JPA repositories
├── service/         Business logic (AuthService, JwtService, StatsService, ScrobbleService, ActivityService, etc.)
└── util/            CookieUtil, TokenHashUtil

src/test/
├── java/            108 tests (integration + unit)
└── resources/
    ├── application-test.yml
    └── testdata/    Synthetic FLAC/MP3 fixtures (ffmpeg-generated)
```

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

- **Dev:** Colored console with `[requestId]` for correlation
- **Docker:** JSON structured logging for aggregation
- MDC `requestId` added by `RequestIdFilter` on every request
