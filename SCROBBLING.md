# Scrobbling — Credenciales y Reproducibilidad

Guía de qué secretos necesita Sonance, de dónde salen, dónde viven, y cómo reproducir
el entorno (tests y app real) en otra máquina.

## TL;DR

- **Tests (`mvn test`): cero credenciales.** WireMock stub-ea Last.fm y ListenBrainz.
  Clonar → `mvn test` → 272 verdes.
- **App real: tres conjuntos de credenciales distintas**, cada una con flujo propio.
- **Nada de secretos en el repo.** Todo pasa por `.env` (gitignored) o por DB por-usuario.

---

## 1. Inventario de credenciales

| Credencial | Origen | Ámbito | Dónde vive |
|---|---|---|---|
| `LASTFM_API_KEY` + `LASTFM_API_SECRET` | Registro de app en <https://www.last.fm/api/account/create> | **Servidor** (una vez, por instalación) | `.env` → inyectado en `application.yml` |
| Last.fm **session key** | Flujo `auth.getMobileSession` (usuario + password + firma HMAC-MD5) | **Por usuario final** | Tabla `User` en DB, **cifrado AES-256-GCM** (S03) |
| ListenBrainz **user token** | El usuario lo copia de <https://listenbrainz.org/profile> | **Por usuario final** | Tabla `User` en DB, **cifrado AES-256-GCM** (S03) |
| `SONANCE_TOKEN_ENCRYPTION_KEY` | Generado local: `openssl rand -hex 32` | **Servidor** (mandatorio desde S03) | `.env` — sin esta var la app no arranca |
| `SONANCE_JWT_SECRET` | Generado local: `openssl rand -base64 48` | **Servidor** | `.env` (default dev peligroso en `application.yml`) |
| `SONANCE_ADMIN_PASSWORD` | Elegido por el admin | **Servidor** (solo seed inicial) | `.env` (default `changeme` en `application.yml`) |

**Clave a entender:** las *API credentials* (key/secret) son del **servidor** — las obtiene el
admin una vez y se comparten. Las *session keys / tokens* son **de cada usuario** — cada uno
las aporta desde Ajustes una vez logueado.

---

## 2. Tests — por qué no necesitas credenciales

El cambio clave de M008/S01 fue convertir las URLs externas de constantes a propiedades
inyectables:

```java
// LastfmService.java:34 — antes
// private static final String API_URL = "https://ws.audioscrobbler.com/2.0/";

@Value("${sonance.lastfm.api-url:https://ws.audioscrobbler.com/2.0/}")
private String apiUrl;
```

Eso permite que `LastfmServiceWireMockTest.java:46-50` haga:

```java
config.setApiKey("test-api-key");          // strings falsos
config.setApiSecret("test-api-secret");
service = new LastfmService(config);
ReflectionTestUtils.setField(service, "apiUrl", wireMock.baseUrl() + "/2.0/");
```

WireMock levanta un HTTP server local en puerto aleatorio y responde exactamente lo que le
programas (401, 429, connection reset, payload válido…). El service cree que habla con
Last.fm pero habla con `localhost:PUERTO`.

**Reproducir los tests en cualquier máquina:**

```bash
git clone <repo>
cd sonance/sonance-server
mvn test
```

Fin. No hace falta `.env`, ni internet, ni cuentas.

---

## 3. Levantar la app real en otra máquina

### 3.1. Configurar `.env`

```bash
cp .env.example .env
```

Editar mínimamente:

```bash
MUSIC_DIR=D:/Musica                                      # tu biblioteca (se monta read-only)
SONANCE_ADMIN_PASSWORD=<elige-uno-seguro>               # evita 'changeme'
SONANCE_JWT_SECRET=$(openssl rand -base64 48)           # mínimo 32 chars
SONANCE_TOKEN_ENCRYPTION_KEY=$(openssl rand -hex 32)    # OBLIGATORIO — la app no arranca sin esta

# Opcionales — solo si vas a permitir scrobbling a Last.fm:
LASTFM_API_KEY=<de last.fm/api/account/create>
LASTFM_API_SECRET=<idem>
```

> **Rotación de `SONANCE_TOKEN_ENCRYPTION_KEY`:** cambiar la clave invalida todos los tokens
> cifrados en DB (session keys de Last.fm y tokens de ListenBrainz). Los usuarios tendrán que
> volver a introducirlos desde Ajustes. No hay mecanismo de re-cifrado automático: sería un
> futuro BSM (Bring Your Own Secret Manager) — no está previsto por ahora.

> **Nota sobre el `.env` actual de este repo:** solo contiene `MUSIC_DIR`,
> `LASTFM_API_KEY` y `LASTFM_API_SECRET`. Los otros dos (`SONANCE_ADMIN_PASSWORD`,
> `SONANCE_JWT_SECRET`) **no están** y caen sobre los defaults de `application.yml`:
> - admin password → `changeme` (emite warning al arranque)
> - JWT secret → `sonance-dev-secret-key-must-be-at-least-32-bytes-long`
>
> Para un entorno local de desarrollo da igual. **Para producción hay que ponerlos**,
> o cualquiera puede firmar tokens JWT válidos contra tu servidor.

### 3.2. Arrancar

```bash
docker compose up -d
```

Primer arranque:
1. `AdminSeeder` crea el usuario `admin` con `SONANCE_ADMIN_PASSWORD`.
2. `LibraryScanService` escanea `/music` (mapeado a `MUSIC_DIR`).
3. La app queda en `http://localhost:8080`.

### 3.3. Onboarding por usuario (scrobbling)

El admin (o cada usuario posterior) se loguea y va a **Ajustes → Scrobbling**:

- **ListenBrainz:** pega su token personal (copiado de listenbrainz.org/profile).
  El servidor guarda el token en `User` y lo usa para `POST /1/submit-listens`.
- **Last.fm:** introduce su user/password de Last.fm. El servidor ejecuta
  `auth.getMobileSession` (firma HMAC con `LASTFM_API_SECRET`), recibe una session key y
  la guarda en `User`. **La password del usuario nunca se persiste** — solo la session
  key a partir de ahí.

Ambos flujos son opcionales e independientes. Un usuario puede activar solo uno, los dos,
o ninguno.

---

## 4. Scripts de desarrollo en `scripts/` (no commiteados)

En `scripts/` hay PowerShell helpers para flujos manuales contra la **API real**:

- `configure-scrobble.ps1` — aplica ajustes de scrobbling a un usuario vía REST.
- `get-lastfm-session.ps1` — ejecuta `auth.getMobileSession` desde la shell sin pasar por la UI.
- `register-and-scan.ps1` — crea usuario + dispara scan.
- `verify-scrobble.ps1` — smoke-test end-to-end contra Last.fm / ListenBrainz de verdad.

**No son necesarios para los tests ni para producción.** Están fuera del commit porque:

1. Dependen de que tu `.env` tenga credenciales reales.
2. Ensucian Last.fm / ListenBrainz con plays de prueba si no tienes cuidado.
3. Son específicos de Windows (PowerShell).

Si alguna vez queremos un smoke-test *live* reproducible, la forma correcta es un
JUnit tag `@Tag("live")` que solo corra con `-Dgroups=live` y `LASTFM_API_KEY` presente
— eso está previsto en M008/S02.

---

## 5. Estado de seguridad

| Aspecto | Estado | Detalle |
|---|---|---|
| Cifrado de tokens | Hecho (M008/S03) | AES-256-GCM con `SONANCE_TOKEN_ENCRYPTION_KEY`. `TokenMigrationRunner` re-cifra filas legacy al arranque. |
| Flyway migrations | Hecho (M008/S03) | Única fuente de verdad de schema (`V1__baseline.sql`, `V2__add_lyrics_columns.sql`). |
| Rate limiting | Hecho | `LoginRateLimitFilter` protege `/api/auth/login`. |
| Request tracing | Hecho | MDC `requestId` en todas las peticiones vía `RequestIdFilter`. |

---

## 6. Checklist rápido — "¿puedo clonar y correr?"

- [ ] `git clone && cd sonance-server && mvn test` → 272 verdes, **sin** configurar nada.
- [ ] Para arrancar la app en local: `cp .env.example .env`, editar `MUSIC_DIR` y
      (recomendado) `SONANCE_ADMIN_PASSWORD` + `SONANCE_JWT_SECRET`. `docker compose up -d`.
- [ ] Para scrobbling Last.fm servidor: registrar app en last.fm/api y añadir `LASTFM_API_KEY`
      + `LASTFM_API_SECRET` al `.env`.
- [ ] Para scrobbling Last.fm / ListenBrainz por usuario: cada usuario lo configura
      desde la UI una vez logueado.
