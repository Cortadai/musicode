package com.musicode.repository;

import com.musicode.model.entity.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {

    Optional<Artist> findByNameIgnoreCase(String name);

    @EntityGraph(attributePaths = {"albums"})
    Optional<Artist> findWithAlbumsById(Long id);

    List<Artist> findByNameContainingIgnoreCase(String name);

    @Query("SELECT a FROM Artist a WHERE SIZE(a.albums) > 0")
    Page<Artist> findAlbumArtists(Pageable pageable);

    @Query("SELECT a FROM Artist a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')) AND SIZE(a.albums) > 0")
    List<Artist> findAlbumArtistsByNameContaining(String name);

    List<Artist> findByHiddenTrueOrderByNameAsc();
}
