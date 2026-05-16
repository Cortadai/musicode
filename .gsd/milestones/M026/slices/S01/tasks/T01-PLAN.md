---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: Initialize Electron package and project structure

Create sonance-desktop/ directory with package.json (electron, electron-builder deps), main.js (BrowserWindow with minWidth:900, minHeight:600, loads localhost:5173), preload.js (contextBridge stub). Add npm scripts for dev and build.

## Inputs

- `Astra reference for BrowserWindow config pattern`

## Expected Output

- `sonance-desktop/ directory with working Electron scaffold`
- `BrowserWindow opens with correct min dimensions`

## Verification

npm install succeeds, npm start launches Electron window pointing to localhost:5173
