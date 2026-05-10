package com.musicode.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Records a single play event — created when a user listens past 50% of a track's duration.
 * Used for stats aggregation, scrobbling triggers, and activity feed.
 */
@Entity
@Table(name = "playback_events", indexes = {
        @Index(name = "idx_playback_user_played", columnList = "user_id, played_at DESC"),
        @Index(name = "idx_playback_track", columnList = "track_id")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PlaybackEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    /** When playback crossed the 50% threshold */
    @Builder.Default
    @Column(nullable = false)
    private Instant playedAt = Instant.now();

    /** How many seconds the user actually listened */
    private Integer listenDurationSec;
}
