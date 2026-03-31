# M005: 

## Vision
Transform Musicode from a functional web app into a polished music player experience — OS-integrated media controls, installable as a native-feeling PWA, and a real-time spectrum visualizer that makes listening visual.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Media Session API | low | — | ✅ | After this: keyboard media keys (play/pause/next/prev) control Musicode. OS shows now-playing notification with track title, artist, and cover art. |
| S02 | PWA Support | low | — | ✅ | After this: browser shows 'Install Musicode' prompt. Installed app opens in standalone window without browser chrome. App shell loads instantly from cache. |
| S03 | Spectrum Visualizer & Micro-animations | medium | S01 | ✅ | After this: frequency spectrum bars animate in real-time during playback. PlayerBar fades in smoothly on first play. Cover art fades in on load. Cover disc spins while playing. |
