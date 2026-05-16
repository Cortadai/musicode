# S01: Scaffold Electron

**Goal:** Set up Electron project structure with main process, preload script, and dev workflow that opens a BrowserWindow loading the React dev server
**Demo:** npm start opens a BrowserWindow loading localhost:5173 (dev mode)

## Must-Haves

- BrowserWindow opens with minWidth:900 minHeight:600, loads React dev server at localhost:5173, app closes cleanly

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Initialize Electron package and project structure** `est:20min`
  Create sonance-desktop/ directory with package.json (electron, electron-builder deps), main.js (BrowserWindow with minWidth:900, minHeight:600, loads localhost:5173), preload.js (contextBridge stub). Add npm scripts for dev and build.
  - Files: `sonance-desktop/package.json`, `sonance-desktop/main.js`, `sonance-desktop/preload.js`
  - Verify: npm install succeeds, npm start launches Electron window pointing to localhost:5173

- [x] **T02: Dev workflow integration** `est:10min`
  Add npm scripts to start React dev server and Electron concurrently. Configure electron to wait for vite dev server before loading. Add .gitignore for node_modules and dist.
  - Files: `sonance-desktop/package.json`, `sonance-desktop/.gitignore`
  - Verify: Single command starts both vite and electron, hot reload works in the electron window

## Files Likely Touched

- sonance-desktop/package.json
- sonance-desktop/main.js
- sonance-desktop/preload.js
- sonance-desktop/.gitignore
