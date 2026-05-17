package com.musicode.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tracks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private Integer trackNumber;

    private Integer discNumber;

    /** Duration in seconds */
    private Integer duration;

    @Column(nullable = false, unique = true)
    private String filePath;

    /** File size in bytes */
    private Long fileSize;

    /** Bitrate in kbps */
    private Integer bitRate;

    /** Sample rate in Hz (e.g. 44100, 96000) */
    private Integer sampleRate;

    /** Bits per sample (e.g. 16, 24) */
    private Integer bitsPerSample;

    @Column(name = "release_year")
    private Integer year;

    private String genre;

    @Column(columnDefinition = "CLOB")
    private String syncedLyrics;

    @Column(columnDefinition = "CLOB")
    private String plainLyrics;

    @Builder.Default
    private Integer lyricsOffsetMs = 0;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @Builder.Default
    private LyricsStatus lyricsStatus = LyricsStatus.NOT_SEARCHED;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "album_id")
    @JsonIgnoreProperties({"tracks", "artist"})
    private Album album;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "artist_id")
    @JsonIgnoreProperties({"albums", "tracks"})
    private Artist artist;
}
