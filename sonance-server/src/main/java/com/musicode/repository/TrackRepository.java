package com.musicode.repository;

import com.musicode.model.entity.Track;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TrackRepository extends JpaRepository<Track, Long> {

    Optional<Track> findByFilePath(String filePath);

    boolean existsByFilePath(String filePath);

    List<Track> findByTitleContainingIgnoreCase(String title);

    long countByAlbumId(Long albumId);

    long countByArtistId(Long artistId);

    List<Track> findByFilePathStartingWith(String pathPrefix);

    // --- Library Health queries ---

    @Query("SELECT t FROM Track t JOIN t.artist a WHERE a.name = 'Unknown Artist'")
    Page<Track> findWithMissingArtist(Pageable pageable);

    @Query("SELECT COUNT(t) FROM Track t JOIN t.artist a WHERE a.name = 'Unknown Artist'")
    long countWithMissingArtist();

    @Query("SELECT t FROM Track t JOIN t.album al WHERE al.title = 'Unknown Album'")
    Page<Track> findWithMissingAlbum(Pageable pageable);

    @Query("SELECT COUNT(t) FROM Track t JOIN t.album al WHERE al.title = 'Unknown Album'")
    long countWithMissingAlbum();

    @Query("SELECT t FROM Track t WHERE t.trackNumber IS NULL OR t.trackNumber = 0")
    Page<Track> findWithMissingTrackNumber(Pageable pageable);

    @Query("SELECT COUNT(t) FROM Track t WHERE t.trackNumber IS NULL OR t.trackNumber = 0")
    long countWithMissingTrackNumber();

    @Query("SELECT t FROM Track t WHERE t.year IS NULL OR t.year = 0")
    Page<Track> findWithMissingYear(Pageable pageable);

    @Query("SELECT COUNT(t) FROM Track t WHERE t.year IS NULL OR t.year = 0")
    long countWithMissingYear();

    @Query("SELECT t FROM Track t WHERE t.genre IS NULL OR t.genre = ''")
    Page<Track> findWithMissingGenre(Pageable pageable);

    @Query("SELECT COUNT(t) FROM Track t WHERE t.genre IS NULL OR t.genre = ''")
    long countWithMissingGenre();
}
