# S05: Polish + Docker Compose — UAT

**Milestone:** M001
**Written:** 2026-03-30T09:59:23.552Z

## UAT: S05 — Polish + Docker Compose\n\n### Test 1: Artist Name Fix\n1. Open album detail page\n2. **Expected:** All tracks show 'Echo Synth' (not 'Unknown')\n\n### Test 2: Loading States\n1. Open any page while data loads\n2. **Expected:** Spinner with descriptive text\n\n### Test 3: Empty States\n1. Before scanning, open Albums page\n2. **Expected:** Message saying 'No albums found. Add a music folder in Settings.'\n\n### Test 4: Docker Compose\n1. Run `docker-compose up --build`\n2. Open http://localhost:3000\n3. **Expected:** Full app works — browse, search, play audio"
