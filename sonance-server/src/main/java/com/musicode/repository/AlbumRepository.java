package com.musicode.repository;

import com.musicode.model.entity.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {

    Optional<Album> findByTitleIgnoreCaseAndArtistId(String title, Long artistId);

    @EntityGraph(attributePaths = {"artist", "tracks"})
    Optional<Album> findWithTracksById(Long id);

    List<Album> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT a FROM Album a WHERE a.artist.hidden = false")
    Page<Album> findVisibleAlbums(Pageable pageable);

    @Query("SELECT a FROM Album a WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :title, '%')) AND a.artist.hidden = false")
    List<Album> findVisibleByTitleContaining(String title);

    long countByArtistId(Long artistId);

    // --- Library Health queries ---

    Page<Album> findByHasCoverArtFalse(Pageable pageable);

    long countByHasCoverArtFalse();
}
