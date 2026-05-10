---
id: M022
title: "Lyrics Sidebar & Album Detail Enrichment"
status: complete
completed_at: 2026-05-09T12:41:14.634Z
key_decisions:
  - Lyrics sidebar uses same QueuePanel pattern with mutual exclusion context
  - Bio section removed — inline Last.fm link is cleaner
  - Hi-res badges use amber #f59e0b matching existing TechBadges
  - Related albums in togglable strip instead of always-visible header column
key_files:
  - musicode-ui/src/context/LyricsSidebarContext.tsx
  - musicode-ui/src/components/player/LyricsSidebar.tsx
  - musicode-ui/src/components/player/PlayerBar.tsx
  - musicode-ui/src/components/library/AlbumInfoCard.tsx
  - musicode-ui/src/pages/AlbumDetailPage.tsx
  - musicode-server/src/main/java/com/musicode/model/dto/ArtistBioDTO.java
  - musicode-server/src/main/java/com/musicode/service/LastfmService.java
  - musicode-server/src/main/java/com/musicode/controller/ArtistController.java
lessons_learned:
  - Dense info cards in album headers need user review — initial 3-column with bio was too busy
  - Matching existing animation patterns (glow/sweep from Play button) keeps UI cohesive
---

# M022: Lyrics Sidebar & Album Detail Enrichment

**Added lyrics sidebar panel with mutual exclusion and enriched album detail with quality badges, Last.fm link, and togglable related albums**

## What Happened

M022 delivered two independent UX enhancements. S01 added a lyrics sidebar accessible from the PlayerBar via Mic2 button, mirroring the QueuePanel pattern with mutual exclusion — opening one closes the other. Works across all 3 shells. S02 enriched the album detail page with audio quality badges (hi-res detection with amber/gold styling), an inline Last.fm link for artists with data, and a togglable related albums strip triggered by an animated Disc3 button. The initial design included a full artist bio section and 3-column layout, but user review led to a cleaner approach: bio replaced with a simple link, layout reverted to 2 columns with proper title truncation.

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

None.

## Follow-ups

None.
