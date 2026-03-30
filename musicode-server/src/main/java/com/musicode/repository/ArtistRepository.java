package com.musicode.repository;

import com.musicode.model.entity.Artist;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    Optional<Artist> findByNameIgnoreCase(String name);

    @EntityGraph(attributePaths = {"albums"})
    Optional<Artist> findWithAlbumsById(Long id);

    List<Artist> findByNameContainingIgnoreCase(String name);
}
