---
id: T01
parent: S01
milestone: M008
key_files:
  - musicode-server/src/test/java/com/musicode/service/StatsServiceTest.java
key_decisions:
  - Usar ArgumentCaptor<Instant> para verificar la lógica privada periodToInstant sin exponerla — testea el contrato observable (qué Instant llega al repo) en vez del método privado directo.
  - Test explícito para BigInteger además de Long en summary — el JDBC driver puede devolver cualquier Number y StatsService usa longValue() precisamente para esto.
duration: 
verification_result: passed
completed_at: 2026-04-16T17:34:03.016Z
blocker_discovered: false
---

# T01: StatsService unit tests — 13 tests, 100% line & branch coverage

**StatsService unit tests — 13 tests, 100% line & branch coverage**

## What Happened

Creado `StatsServiceTest` con 13 tests que cubren los 5 métodos públicos y la resolución de `periodToInstant` por capturador de argumentos. Casos: mapeo de filas para top artists/albums/tracks; summary con lista vacía, fila numérica y fila con BigInteger (coerción vía `Number.longValue()`); history con java.sql.Date, LocalDate, String y lista vacía; resolución de periodos null/blank/all/ALL → EPOCH, week/month/year → Instant relativo a now, unknown → EPOCH. Mockito genera stubs de PlaybackEventRepository; el primer intento falló por inferencia de tipos (List.of con Object[] se resuelve como List<Object>) — resuelto con tipo explícito List.<Object[]>of(...).

## Verification

mvn -Dtest=StatsServiceTest test → 13 tests run, 0 failures, 0 errors. JaCoCo reporta StatsService 100% líneas (38/38), 100% ramas (16/16), 0 missed.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `mvn -Dtest=StatsServiceTest test` | 0 | pass | 3557ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-server/src/test/java/com/musicode/service/StatsServiceTest.java`
