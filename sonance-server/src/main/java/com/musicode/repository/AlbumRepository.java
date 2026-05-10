package com.musicode.repository;

import com.musicode.model.entity.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {

    Optional<Album> findByTitleIgnoreCaseAndArtistId(String title, Long artistId);

    @EntityGraph(attributePaths = {"artist", "tracks"})
    Optional<Album> findWithTracksById(Long id);

    List<Album> findByTitleContainingIgnoreCase(String title);

    long countByArtistId(Long artistId);

    // --- Library Health queries ---

    Page<Album> findByHasCoverArtFalse(Pageable pageable);

    long countByHasCoverArtFalse();
}
