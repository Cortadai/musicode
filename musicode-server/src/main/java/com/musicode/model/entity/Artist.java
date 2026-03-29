package com.musicode.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artists")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Album> albums = new ArrayList<>();

    @OneToMany(mappedBy = "artist")
    @Builder.Default
    private List<Track> tracks = new ArrayList<>();
}
