# M018: Cassette Deck — Retro Mode

## Vision
A standalone full-screen cassette deck experience that replaces the standard player UI when activated. Physical tape physics (reel rotation, tape path, angular velocity), analog VU meters driven by the existing AnalyserNode, a detailed deck housing with odometer and transport LEDs, synthwave atmosphere (neon glow, scanlines, dynamic album colors), and an optional tape audio filter (lo-fi EQ, wow & flutter, hiss). This is the crown jewel of Musicode — the feature the entire project was built to reach.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Cassette Canvas — Body, Reels & Tape Physics | high | — | ✅ | Full-screen canvas showing a detailed cassette with two reels spinning at physically accurate speeds, tape path moving between them, and label displaying current track info with album colors |
| S02 | Deck Housing — VU Meters, Odometer, Transport & LEDs | high | S01 | ✅ | Cassette now sits inside a full deck housing with dual VU meters bouncing to the music, a rolling mechanical odometer, and lit transport LEDs reflecting play/pause/seek state |
| S03 | Atmosphere — Neon Glow, Scanlines, Dynamic Colors & Animations | medium | S01 | ✅ | The deck now has full synthwave atmosphere: neon underglow tinted by album colors, CRT scanlines overlay, warm amber accents, and smooth transitions on track change |
| S04 | Tape Audio Filter — Lo-Fi Chain, Wow & Flutter, Hiss | medium | S01 | ✅ | Toggle a 'TAPE' button on the deck to hear the music through a cassette tape simulation: slightly muffled highs, subtle pitch wobble, and optional tape hiss |
