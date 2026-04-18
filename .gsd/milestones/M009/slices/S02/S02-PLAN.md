# S02: Persistencia de preferencias en localStorage

**Goal:** Persistir volumen, shuffle y repeat en localStorage para que sobrevivan al reload del navegador. Restaurar al iniciar la app.
**Demo:** Recarga la pagina: el volumen, shuffle y repeat se mantienen. Antes se perdian. Borra localStorage: el player arranca con defaults sanos.

## Must-Haves

- Volume, shuffle y repeatMode persisten entre reloads. Valores inválidos en localStorage se resetean a defaults sin error visible.

## Proof Level

- This slice proves: behavioral — verificado en browser: cambiar preferencias, recargar página, confirmar que se mantienen

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Create audioPreferences module and wire to PlayerContext** `est:30min`
  Create musicode-ui/src/audio/audioPreferences.ts — a small module that reads/writes volume, shuffle, and repeatMode to localStorage under a 'musicode-prefs' key. Read on app init to hydrate initialState in PlayerContext. Write on every SET_VOLUME, TOGGLE_SHUFFLE, TOGGLE_REPEAT action via a middleware-style effect in the reducer or a useEffect in PlayerProvider. Handle invalid/missing values gracefully: parse errors reset to defaults (volume 0.8, shuffle false, repeatMode 'off').
  - Files: `musicode-ui/src/audio/audioPreferences.ts`, `musicode-ui/src/context/PlayerContext.tsx`
  - Verify: TypeScript compiles. Change volume to 0.3, shuffle on, repeat all → reload page → values restored. Clear localStorage → reload → defaults applied, no console errors.

## Files Likely Touched

- musicode-ui/src/audio/audioPreferences.ts
- musicode-ui/src/context/PlayerContext.tsx
