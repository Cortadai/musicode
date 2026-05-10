package com.musicode.model.dto;

import java.time.Instant;

public record RecentPlay(
        String trackTitle,
        String artistName,
        String albumTitle,
        Long albumId,
        boolean hasCoverArt,
        Instant playedAt
) {}
