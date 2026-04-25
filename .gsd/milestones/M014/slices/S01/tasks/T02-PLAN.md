---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: Repository queries custom para health checks

Añadir queries JPQL/native a TrackRepository y AlbumRepository para los checks que no se resuelven con métodos derivados: tracks con título igual al nombre del archivo, álbumes sin cover, álbumes con artistas mixtos entre tracks. Queries paginadas con Pageable.

## Inputs

- `Track entity schema`
- `Album entity schema`
- `H2 SQL compatibility`

## Expected Output

- `Custom @Query methods en TrackRepository`
- `Custom @Query methods en AlbumRepository`
- `Queries con soporte Pageable para paginación`

## Verification

Integration tests con H2 que insertan datos de prueba y validan resultados de cada query
