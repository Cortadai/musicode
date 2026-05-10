# S05: PWA Offline Basics — UAT

**Milestone:** M024
**Written:** 2026-05-10T08:36:51.401Z

## UAT — S05: PWA Offline Basics

### Pre-requisitos
- Build de producción (`npm run build`)
- Servir dist/ con un servidor estático (e.g. `npx serve dist`)

### Tests

| # | Escenario | Pasos | Esperado |
|---|-----------|-------|----------|
| 1 | Manifest válido | Abrir DevTools > Application > Manifest | Muestra name, icons, display:standalone, sin warnings |
| 2 | SW registrado | DevTools > Application > Service Workers | SW activo en scope `/` |
| 3 | Installable | Barra de dirección muestra icono de instalar (Chrome/Edge) | Click instala la app como standalone |
| 4 | Offline — app shell | Activar modo offline en DevTools > Network | La página carga (HTML/CSS/JS desde cache) |
| 5 | Offline — banner | Con offline activado, navegar la app | Banner amber "Sin conexión" visible en la parte superior |
| 6 | Online — banner desaparece | Desactivar modo offline | Banner desaparece inmediatamente |
| 7 | Cover art cacheado | Navegar un álbum online, luego ir offline y volver al álbum | Cover art se muestra desde cache |
