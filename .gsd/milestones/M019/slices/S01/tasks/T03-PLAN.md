---
estimated_steps: 1
estimated_files: 7
skills_used: []
---

# T03: Migrate shared component colors from hardcoded Tailwind to CSS variables

Replace hardcoded zinc-950, zinc-900, zinc-800, zinc-700, zinc-500, zinc-400, zinc-300, zinc-100 Tailwind classes in layout and shared components with CSS variable equivalents using Tailwind arbitrary values (e.g. bg-[var(--bg-base)], text-[var(--text)], border-[var(--border)]). Target files: Sidebar, TopBar, PlayerBar wrapper, page container backgrounds, card borders. Add glassmorphism utility classes to index.css (.glass-card, .glass-panel) using theme CSS variables. Ensure Evolved theme looks identical to current app — this is a refactor, not a visual change.

## Inputs

- `musicode-ui/src/context/ThemeContext.tsx`
- `musicode-ui/src/themes/evolved.ts`
- `musicode-ui/src/components/layout/Sidebar.tsx`
- `musicode-ui/src/components/layout/TopBar.tsx`
- `musicode-ui/src/components/player/PlayerBar.tsx`

## Expected Output

- `musicode-ui/src/index.css`
- `musicode-ui/src/components/layout/Sidebar.tsx`
- `musicode-ui/src/components/layout/TopBar.tsx`
- `musicode-ui/src/components/player/PlayerBar.tsx`
- `musicode-ui/src/components/layout/shells/EvolvedShell.tsx`
- `musicode-ui/src/components/layout/shells/NovatouchShell.tsx`
- `musicode-ui/src/components/layout/shells/MinimalShell.tsx`

## Verification

npm run build passes. Visual comparison in browser: Evolved theme looks identical to current app. Novatouch/Minimal shells pick up their respective color tokens.
