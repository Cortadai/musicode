---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T05: Verificación de cobertura global ≥40%

Ejecutar suite completa con coverage, verificar que se alcanza el objetivo de 40% lines. Ajustar si falta cobertura en algún área.

## Inputs

- `Todos los tests creados en T01-T04`

## Expected Output

- `Coverage report ≥40% lines`
- `166+ tests pasando`

## Verification

vitest --run --coverage muestra ≥40% lines en All files
