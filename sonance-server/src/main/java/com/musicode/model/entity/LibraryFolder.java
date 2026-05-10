package com.musicode.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "library_folders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LibraryFolder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String path;

    private LocalDateTime lastScannedAt;

    @Builder.Default
    private int trackCount = 0;
}
