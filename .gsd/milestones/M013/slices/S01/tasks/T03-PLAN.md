---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: Create useDynamicTheme hook

React hook that: reads dynamicTheme pref, when enabled + track changes calls extractColors, sets CSS custom properties (--np-color-1, --np-color-2, --np-bg) on document.documentElement. When disabled, removes variables. Returns { enabled, toggle, colors }.

## Inputs

- `colorExtraction.ts`
- `audioPreferences.ts`
- `PlayerContext current track`

## Expected Output

- `useDynamicTheme.ts hook`

## Verification

Hook returns correct state, toggling persists preference, CSS variables set/removed on document
