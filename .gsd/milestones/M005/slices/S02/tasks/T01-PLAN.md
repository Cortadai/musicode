---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T01: PWA manifest + icons

Create PWA icons (192x192 and 512x512) as simple SVG-based PNGs or use a minimal icon. Create manifest.json in public/ with: name 'Musicode', short_name 'Musicode', start_url '/', display 'standalone', theme_color (indigo-600 = #4f46e5), background_color (zinc-950 = #09090b), icons array. Add manifest link to index.html. Add theme-color meta tag.

## Inputs

- `Current index.html`

## Expected Output

- `public/manifest.json`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `Updated index.html`

## Verification

npm run build compiles
