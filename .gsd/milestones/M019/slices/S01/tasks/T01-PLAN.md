---
estimated_steps: 1
estimated_files: 6
skills_used: []
---

# T01: Create ThemeProvider context, theme types, and Evolved token set

Define the ThemeConfig type with id, name, cssVars record, and layoutType enum (evolved|novatouch|minimal). Create Evolved theme tokens from mockup-B CSS variables (--bg-base, --bg-surface, --bg-elevated, --border, --text, --text-2, --text-3, --accent, --accent-dim, --accent-glow, --glass-bg, --glass-border, --radius-sm/md/lg, --wf-played/unplayed/buffered). Create ThemeContext with provider that: (1) reads initial theme from localStorage, (2) injects CSS variables on document.documentElement, (3) exposes activeTheme + setTheme. Create stub token sets for Novatouch (purple-cold palette) and Minimal (neutral). Export useTheme hook.

## Inputs

- `reference/mockups/mockup-B-musicode-evolved.html`
- `reference/mockups/mockup-A-astra-clone.html`
- `reference/mockups/mockup-C-minimal-premium.html`

## Expected Output

- `musicode-ui/src/types/theme.ts`
- `musicode-ui/src/context/ThemeContext.tsx`
- `musicode-ui/src/themes/evolved.ts`
- `musicode-ui/src/themes/novatouch.ts`
- `musicode-ui/src/themes/minimal.ts`
- `musicode-ui/src/themes/index.ts`

## Verification

npm run build passes. ThemeProvider renders without errors. useTheme returns evolved as default.
