package com.musicode.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "video_folders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class VideoFolder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 1024)
    private String path;

    @Builder.Default
    private int videoCount = 0;

    private LocalDateTime lastScannedAt;
}
