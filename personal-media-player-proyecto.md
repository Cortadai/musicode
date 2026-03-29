---
tipo: proyecto
estado: planificado
fecha: 2026-03-29
tags:
  - audio
  - hifi
  - spring-boot
  - angular
  - docker
  - side-project
---

# Personal Media Player — Mi propio reproductor multimedia

## Origen de la idea

### El descubrimiento de Monochrome

Todo empezó explorando [mono.squid.wtf](https://mono.squid.wtf/), una instancia de **Monochrome Music** — un cliente web open source, ligero y enfocado en privacidad para streaming de música Hi-Fi, construido sobre TIDAL.

Lo que me llamó la atención fue la calidad de la interfaz: minimalista, bonita, con visualizador de espectro, temas personalizables, carátulas animadas, y soporte para audio Hi-Res/lossless. Todo en un navegador web.

Monochrome es open source y se puede self-hostear con Docker:

```bash
git clone https://github.com/monochrome-music/monochrome.git
cd monochrome
docker compose up -d
```

- Repo principal: <https://github.com/monochrome-music/monochrome>
- Web oficial: <https://monochrome.tf/>
- Fork single-file: <https://github.com/thecatthatflies/monomusic>

### Otras alternativas exploradas

Durante la investigación también descubrí reproductores self-hosted interesantes para bibliotecas locales:

- **Swing Music** — Self-hosted, interfaz tipo Spotify, crossfade, daily mixes, detección de silencios. Docker ready. Muy maduro para colecciones locales. Repo: <https://github.com/swingmx/swingmusic>
- **Navidrome** — Servidor de música compatible con Subsonic/Airsonic. Web UI + clientes móviles. Referencia del ecosistema self-hosted. Repo: <https://github.com/navidrome/navidrome>
- **Feishin** — Cliente de escritorio NextJS/Electron para conectar a Navidrome u otros backends Subsonic.

### El contexto legal: por qué estos proyectos existen

Servicios como TIDAL, Qobuz, Deezer y Amazon Music no aplican DRM al stream de audio. La protección está solo en la capa de autenticación (token de sesión). Una vez autenticado, el audio que baja es un FLAC limpio, bit-perfect. Por eso existen tantas herramientas de descarga y clientes alternativos.

En cambio, Spotify (Widevine) y Apple Music (FairPlay) sí cifran el stream con DRM real.

Estas plataformas no meten DRM porque su público son audiófilos — gente que usa DACs externos, reproductores dedicados, etc. El DRM degradaría la compatibilidad y perderían más clientes legítimos de los que ganarían evitando piratería.

### La decisión: construir mi propio reproductor

En lugar de depender de instancias ajenas o APIs de terceros, la idea es construir un reproductor personal para mi propia biblioteca de archivos multimedia (FLACs de Bandcamp, MP3s, etc.). 100% legal, 100% mío, 100% educacional.

**Filosofía:** Mi propio VLC pero más bonito, personal y con más cosas. Cuando quiera reproducir mis archivos multimedia, lo uso.

---

## Arquitectura propuesta

### Stack tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | Angular | Mi stack habitual, PWA nativa |
| Backend | Spring Boot + Maven | Mi stack habitual, streaming eficiente |
| Base de datos | H2 embebida | Zero config, un JAR, sin servidor externo |
| Lectura de tags | jaudiotagger | Librería Java pura para ID3/Vorbis/MP4 |
| Contenedores | Docker Compose | Portabilidad total |

### Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────┐
│              Docker Compose · localhost              │
│                                                     │
│  ┌──────────────────┐     ┌──────────────────────┐  │
│  │  Angular Frontend │────▶│  Spring Boot Backend │  │
│  │                   │HTTP │                      │  │
│  │  · Web Audio API  │     │  · Media scanner     │  │
│  │  · Media Session  │     │  · Tag reader         │  │
│  │  · Visualizer     │     │  · Transcoder         │  │
│  │  · PWA · Themes   │     │  · Album art / Lyrics │  │
│  └──────────────────┘     └──────────┬───────────┘  │
│                                      │              │
│                           ┌──────────┴──────────┐   │
│                           │                     │   │
│                    ┌──────▼──────┐  ┌───────────▼┐  │
│                    │ Filesystem  │  │ H2 / SQLite│  │
│                    │ FLAC MP3    │  │ Metadata   │  │
│                    │ OGG MP4     │  │ cache      │  │
│                    └─────────────┘  └────────────┘  │
│                                                     │
│  ┌─────────────────── Opcional ───────────────────┐  │
│  │ Last.fm │ ListenBrainz │ Subsonic API │ DLNA  │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Detalle de cada pieza

### jaudiotagger — Lectura de metadatos

Librería Java pura para leer y escribir tags de archivos de audio. Abstrae los distintos formatos de metadatos (ID3 para MP3, Vorbis Comments para FLAC, átomos MP4 para M4A/AAC) bajo una API unificada.

Dado un `File`, devuelve artista, álbum, año, número de pista, género, duración, y hasta la carátula embebida en binario. Es la pieza que convierte archivos sueltos en una biblioteca con estructura.

```java
AudioFile audioFile = AudioFileIO.read(new File("/music/track.flac"));
Tag tag = audioFile.getTag();
String artist = tag.getFirst(FieldKey.ARTIST);
String album = tag.getFirst(FieldKey.ALBUM);
Artwork artwork = tag.getFirstArtwork();
```

### MediaScannerService — Escaneo de biblioteca

Servicio Spring Boot propio. Al arrancar (o bajo demanda), recorre recursivamente las carpetas de música configuradas, usa jaudiotagger para extraer metadatos, y los persiste en H2.

El rescan incremental detecta solo archivos nuevos comparando timestamps o hashes del filesystem, sin releer toda la biblioteca cada vez.

Es lo que hacen iTunes o Windows Media Player al "monitorizar una carpeta", pero controlado por nosotros.

### H2 — Base de datos embebida

Base de datos Java pura (un JAR) que no necesita servidor separado. Se incluye como dependencia Maven y arranca dentro del propio Spring Boot.

Cachea metadatos: artista, álbum, pista, duración, ruta, formato, bitrate, sample rate, carátula (referencia), etc. Las queries son instantáneas en vez de releer tags de miles de archivos.

Para un proyecto personal de un solo usuario, es más que suficiente y elimina la dependencia externa de PostgreSQL o MySQL.

### Range headers — Streaming HTTP con seek

Cuando el navegador reproduce audio vía `<audio src="/api/tracks/123/stream">`, necesita poder saltar a cualquier punto sin descargar todo el fichero.

El navegador envía `Range: bytes=5242880-` → el backend responde `206 Partial Content` con solo ese segmento. Sin esto, el seek no funciona.

En Spring Boot se implementa con `ResourceHttpRequestHandler` o manejando manualmente la cabecera Range y escribiendo el rango pedido en el OutputStream del response.

### Web Audio API — Visualizador y procesamiento

API nativa del navegador para acceso de bajo nivel al pipeline de audio. Dos usos principales:

1. **Visualizador de espectro** — Conectar un `AnalyserNode` a la fuente de audio y leer un array de frecuencias en tiempo real. Se pinta con Canvas o SVG. Es lo que da vida visual al reproductor.
2. **Procesamiento en tiempo real** — Ecualizador (cadena de `BiquadFilterNode`), crossfade entre pistas (dos `GainNode` con transición), control de volumen fino.

Pipeline: `AudioSource → AnalyserNode → GainNode → Destination`

### Media Session API — Integración con el SO

API nativa del navegador que conecta tu reproductor web con los controles multimedia del sistema operativo.

Al reproducir una canción, le dices al navegador: "estoy reproduciendo X de Y con esta carátula". Windows muestra su overlay multimedia con esos datos. También captura eventos de las teclas multimedia del teclado (play, pause, next, prev) para controlar tu reproductor personalizado.

Sin esto, la app es "invisible" para el SO — las teclas multimedia no hacen nada.

### PWA — Progressive Web App

Empaqueta la app Angular como aplicación nativa sin Electron. Se añade un `manifest.json` (icono, nombre, color del tema) y un Service Worker (caché offline).

El navegador ofrece "instalar" la app → aparece en el menú de inicio de Windows, se abre en su propia ventana sin barra de direcciones, y la UI carga incluso sin conexión (el audio necesita red si no está cacheado).

Angular lo soporta nativamente: `ng add @angular/pwa`.

### Last.fm scrobbling — Historial de escucha

Cada vez que terminas una canción (o superas el 50% de duración), tu backend envía un POST a la API de Last.fm registrando la escucha.

Con el tiempo genera estadísticas, recomendaciones, y un historial de años de lo que has oído. API REST estándar con API key.

En el backend sería un `LastFmScrobblerService` suscrito a eventos de reproducción.

### ListenBrainz — Alternativa open source a Last.fm

Mismo concepto de scrobbling, mantenido por MusicBrainz (la Wikipedia de la música). Sin dependencia de empresa privada. API muy similar.

Muchos audiófilos usan ambos en paralelo por redundancia.

### Protocolo Subsonic / OpenSubsonic — Clientes móviles gratis

Estándar abierto que define una API REST para servidores de música. Si el backend implementa los endpoints de Subsonic (`/rest/getAlbumList`, `/rest/stream`, `/rest/search3`...), automáticamente se pueden usar docenas de apps cliente ya existentes:

- **Android:** Symfonium, Tempo, DSub
- **iOS:** play:Sub, SubStreamer
- **Desktop:** Feishin, Sonixd
- **Media center:** Kodi

Es lo que hace Navidrome internamente. No hay que implementar todo el protocolo desde el inicio, solo los endpoints core: autenticación, listado y streaming.

### DLNA / UPnP — Reproducción en red local

Protocolo de red local para descubrir y reproducir multimedia entre dispositivos. Si el servidor implementa DLNA, cualquier smart TV, altavoz inteligente o receptor AV de la red local puede descubrir la biblioteca y reproducirla.

Es la integración más compleja y menos prioritaria, pero la más espectacular: darle a play desde la tele del salón y que suene un FLAC servido desde tu PC.

### Docker Compose — Despliegue portable

Un `docker-compose.yml` que monta:

- Volumen con la carpeta de música (`/mnt/music:/music:ro`, solo lectura)
- El backend Spring Boot
- El frontend Angular (servido desde el mismo Spring Boot o nginx separado)
- Volumen para la base de datos H2

Si mañana se mueve a un mini PC o un NAS, se copia el compose y funciona igual.

---

## Plan de implementación por fases

### Fase 1 — Core funcional (MVP)

> Objetivo: reproducir un FLAC desde el navegador, servido por Spring Boot.

- Modelo de datos: `Artist`, `Album`, `Track` con JPA/H2
- `MediaScannerService` con jaudiotagger
- Endpoint REST: `GET /api/tracks/{id}/stream` con soporte Range headers
- Endpoints CRUD: artistas, álbumes, pistas, búsqueda
- Frontend Angular mínimo: listado de pistas + componente `<audio>` funcional
- Docker Compose básico

### Fase 2 — UI / UX

> Objetivo: que sea bonito y usable en el día a día.

- Diseño inspirado en Monochrome (dark theme, minimalista)
- Visualizador de espectro con Web Audio API
- Extracción y visualización de carátulas
- Cola de reproducción, shuffle, repeat
- Media Session API (integración con controles del SO)
- PWA (instalable como app de escritorio)
- Sistema de temas personalizables

### Fase 3 — Integraciones externas

> Objetivo: conectar con el ecosistema Hi-Fi.

- Last.fm scrobbling
- ListenBrainz scrobbling
- Implementación parcial de Subsonic API (para clientes móviles)
- Letras sincronizadas (búsqueda en APIs públicas)

### Fase 4 — Avanzado (nice to have)

> Objetivo: features premium que lo diferencien.

- Transcoding al vuelo (FLAC → OGG/OPUS para móvil con ancho de banda limitado)
- DLNA/UPnP server
- Ecualizador paramétrico vía Web Audio API
- Crossfade entre pistas
- Detección de silencios
- Estadísticas de escucha propias (sin depender de Last.fm)
- Soporte para vídeo (clips musicales)

---

## Referencias y recursos

- [Monochrome Music (GitHub)](https://github.com/monochrome-music/monochrome)
- [Swing Music](https://github.com/swingmx/swingmusic)
- [Navidrome](https://github.com/navidrome/navidrome)
- [jaudiotagger](https://www.jthink.net/jaudiotagger/)
- [Web Audio API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Media Session API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API)
- [Subsonic API docs](http://www.subsonic.org/pages/api.jsp)
- [OpenSubsonic spec](https://opensubsonic.netlify.app/)
- [Last.fm API](https://www.last.fm/api)
- [ListenBrainz API](https://listenbrainz.readthedocs.io/en/latest/users/api/index.html)
- [Angular PWA](https://angular.io/guide/service-worker-getting-started)
