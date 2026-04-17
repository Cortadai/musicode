package com.musicode.model.entity;

import com.musicode.util.EncryptedStringConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    @Column(nullable = false)
    private boolean enabled = true;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // --- Scrobble integration ---
    // Stored encrypted at rest via EncryptedStringConverter ("v1:" + AES-GCM ciphertext).
    // Reads tolerate legacy plaintext; TokenMigrationRunner re-encrypts on startup.

    /** ListenBrainz user token (from https://listenbrainz.org/profile/) */
    @Convert(converter = EncryptedStringConverter.class)
    private String listenbrainzToken;

    /** Last.fm session key (obtained via auth.getMobileSession, valid indefinitely) */
    @Convert(converter = EncryptedStringConverter.class)
    private String lastfmSessionKey;
}
