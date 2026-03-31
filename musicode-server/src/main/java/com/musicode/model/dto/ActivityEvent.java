package com.musicode.model.dto;

import java.time.Instant;

public record ActivityEvent(
        String username,
        String trackTitle,
        String artistName,
        String albumTitle,
        Long albumId,
        boolean hasCoverArt,
        Instant timestamp
) {}
