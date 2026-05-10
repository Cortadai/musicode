---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T04: Add theme selector UI and verify end-to-end theme switching

Create ThemeSelector component — segmented control showing three theme names with active indicator (indigo highlight). Place it in TopBar (right side, before user menu). Clicking a theme: updates ThemeContext, CSS variables swap on :root, layout shell switches. Verify in browser: (1) Evolved renders current sidebar layout with indigo accents, (2) Novatouch renders icon sidebar with purple-cold palette, (3) Minimal renders horizontal nav with neutral palette, (4) choice persists across page reload, (5) all navigation links work in all three shells, (6) PlayerBar renders correctly in all shells, (7) keyboard shortcuts work in all shells. Run npm run build to confirm zero errors.

## Inputs

- `musicode-ui/src/context/ThemeContext.tsx`
- `musicode-ui/src/components/layout/TopBar.tsx`
- `musicode-ui/src/components/layout/AppShell.tsx`

## Expected Output

- `musicode-ui/src/components/common/ThemeSelector.tsx`
- `musicode-ui/src/components/layout/TopBar.tsx`

## Verification

npm run build passes. Theme selector visible in TopBar. Switching themes changes layout and colors. localStorage musicode-theme persists across reload.
