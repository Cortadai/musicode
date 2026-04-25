---
estimated_steps: 1
estimated_files: 6
skills_used: []
---

# T01: Health check DTOs y LibraryHealthService

Crear DTOs (HealthSummary, HealthIssue, IssueType enum) y LibraryHealthService con todos los checks: track sin título útil, sin artista, sin álbum, sin track number, sin año, sin género, álbum sin cover art (usar hasCoverArt flag), álbum con artistas inconsistentes entre sus tracks. Cada check es un método que devuelve conteo y lista paginada.

## Inputs

- `Track.java entity model`
- `Album.java entity model`
- `Existing repository interfaces`

## Expected Output

- `HealthSummary DTO con conteo por IssueType`
- `HealthIssue DTO con id, type, entityName, filePath, severity, description`
- `IssueType enum con todos los tipos de issue`
- `LibraryHealthService con getSummary() y getIssues(type, page, size)`

## Verification

Unit tests para cada check con datos que cubren caso positivo y negativo
