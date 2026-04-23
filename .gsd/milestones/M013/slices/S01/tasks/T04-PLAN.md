---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T04: Write tests for color extraction and hook

Vitest tests for extractColors (mock canvas/image) and useDynamicTheme (mock preferences, verify CSS variable injection). Test fallback when image fails to load.

## Inputs

- `colorExtraction.ts`
- `useDynamicTheme.ts`

## Expected Output

- `Test files with passing assertions`

## Verification

All new tests pass with npx vitest --run
