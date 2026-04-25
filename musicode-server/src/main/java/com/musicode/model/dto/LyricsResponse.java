package com.musicode.model.dto;

import com.musicode.model.entity.LyricsStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LyricsResponse {
    private final Long trackId;
    private final LyricsStatus status;
    private final String syncedLyrics;
    private final String plainLyrics;
}
