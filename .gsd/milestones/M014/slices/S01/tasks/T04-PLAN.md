---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T04: Tests de integración completos

Tests @SpringBootTest que insertan una librería de prueba con issues conocidos (tracks sin artista, álbumes sin cover, etc.) y validan que summary devuelve conteos correctos y issues devuelve los registros esperados. Cubrir edge cases: librería vacía, librería sin issues.

## Inputs

- `LibraryHealthService`
- `LibraryHealthController`
- `Test data setup pattern from existing tests`

## Expected Output

- `LibraryHealthServiceTest con tests para cada check`
- `LibraryHealthControllerTest con MockMvc tests para endpoints`

## Verification

mvn test -pl musicode-server pasa sin fallos
