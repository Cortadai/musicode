# S01: Fixes + Multi-format Scanner — UAT

**Milestone:** M002
**Written:** 2026-03-30T10:45:36.164Z

## UAT: S01 — Fixes + Multi-format Scanner\n\n### Test 1: Multi-format Scan\n1. Add a folder containing FLAC + MP3 files\n2. Trigger scan\n3. **Expected:** Both FLAC and MP3 files are processed and appear as tracks\n\n### Test 2: ScanStatus JSON\n1. GET /api/library/scan/status\n2. **Expected:** JSON includes scanning (boolean), filesFound, errors fields"
