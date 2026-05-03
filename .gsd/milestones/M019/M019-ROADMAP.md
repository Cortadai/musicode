# M019: UX Polish — Three Themes + Feature Upgrade

## Vision
Elevar Musicode a nivel de reproductor premium con tres themes intercambiables (Evolved, Novatouch, Minimal), home page con carruseles, play bar rediseñada, favoritos, queue/now playing panels, y glassmorphism. Inspirado en Astra Music pero manteniendo la identidad Musicode (multi-usuario, stats, scrobbling, cassette deck, activity feed).

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Theme Foundation | high | — | ✅ | Theme selector switches between Evolved layout (sidebar) and placeholder shells for Novatouch/Minimal. CSS variables change colors/spacing per theme. |
| S02 | Home Page | medium | S01 | ✅ | Home page con saludo dinámico, carruseles de recently played/albums/artists con datos reales, stats de librería, glassmorphism cards con hover lift. |
| S03 | Play Bar Redesign | high | S01 | ✅ | Play bar con 3 secciones (now playing / controles+waveform / utilidades), badges técnicos FMT|BIT|KHZ, volumen numérico, marquee en títulos largos. |
| S04 | Library Enhancement | medium | S01 | ✅ | Library con tabs TRACKS|ALBUMS|ARTISTS con contadores, tabla de tracks enriquecida con codec badges y miniaturas, artist avatares circulares. |
| S05 | Favorites | medium | S01, S03 | ✅ | Corazón en play bar y track list togglea favorito. Vista de favoritos en librería. Persistencia por usuario. |
| S06 | Panels — Queue + Now Playing + Lyrics | medium | S03 | ✅ | Queue panel con drag-reorder y clear. Now Playing panel lateral con tabs INFO/LYRICS. Lyrics slide-up desde play bar. |
| S07 | Novatouch Theme | low | S01 | ✅ | Theme Novatouch activo con sidebar de iconos 56px, hero con saludo dinámico, estética fría purple, glassmorphism pronunciado. |
| S08 | Minimal Theme | low | S01 | ✅ | Theme Minimal con navegación horizontal (sin sidebar), tipografía mono, spacing ultra limpio. |
