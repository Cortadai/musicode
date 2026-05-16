# S01: Scaffold Electron — UAT

**Milestone:** M026
**Written:** 2026-05-10T13:47:45.419Z

## UAT — S01: Scaffold Electron\n\n### Prerequisites\n- Node.js installed\n- `cd sonance-desktop && npm install` completed\n- `cd sonance-ui && npm install` completed\n\n### Test Cases\n\n- [ ] **TC1: Dev workflow starts** — Run `npm run dev` from sonance-desktop/. Vite starts on port 5173, then Electron window opens.\n- [ ] **TC2: Window constraints** — Try to resize the window below 900x600. Window should not go smaller.\n- [ ] **TC3: Hot reload** — Edit a React component. Change should reflect in the Electron window without restart.\n- [ ] **TC4: Clean exit** — Close the Electron window. Both vite and electron processes terminate (no orphans).</uatContent>
</invoke>
