package com.musicode.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_favorites",
        uniqueConstraints = @UniqueConstraint(name = "uk_user_track", columnNames = {"user_id", "track_id"}),
        indexes = @Index(name = "idx_fav_user_created", columnList = "user_id, created_at DESC"))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
