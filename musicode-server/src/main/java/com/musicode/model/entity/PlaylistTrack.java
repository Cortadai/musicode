package com.musicode.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "playlist_tracks",
        uniqueConstraints = @UniqueConstraint(name = "uk_playlist_track", columnNames = {"playlist_id", "track_id"}),
        indexes = @Index(name = "idx_pt_playlist_pos", columnList = "playlist_id, position"))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PlaylistTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @Column(nullable = false)
    private Integer position;

    @Builder.Default
    @Column(nullable = false)
    private Instant addedAt = Instant.now();
}
