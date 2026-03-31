package com.musicode.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrackMetadata {

    private String title;
    private String artist;
    private String albumArtist;
    private String album;
    private Integer year;
    private Integer trackNumber;
    private Integer discNumber;
    private Integer durationSeconds;
    private String genre;
    private Integer bitRate;
    private Integer sampleRate;
    private Integer bitsPerSample;
    private Long fileSize;
    private String filePath;

    /** Cover art bytes (JPEG/PNG), null if no embedded art */
    private byte[] coverArt;

    /** MIME type of the cover art (e.g. "image/jpeg") */
    private String coverArtMimeType;
}
