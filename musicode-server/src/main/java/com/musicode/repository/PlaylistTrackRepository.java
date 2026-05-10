package com.musicode.repository;

import com.musicode.model.entity.PlaylistTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PlaylistTrackRepository extends JpaRepository<PlaylistTrack, Long> {

    List<PlaylistTrack> findByPlaylistIdOrderByPositionAsc(Long playlistId);

    Optional<PlaylistTrack> findByPlaylistIdAndTrackId(Long playlistId, Long trackId);

    boolean existsByPlaylistIdAndTrackId(Long playlistId, Long trackId);

    @Query("SELECT COALESCE(MAX(pt.position), 0) FROM PlaylistTrack pt WHERE pt.playlist.id = :playlistId")
    int findMaxPositionByPlaylistId(Long playlistId);

    @Modifying
    @Query("DELETE FROM PlaylistTrack pt WHERE pt.playlist.id = :playlistId AND pt.track.id IN :trackIds")
    void deleteByPlaylistIdAndTrackIdIn(Long playlistId, Collection<Long> trackIds);

    long countByPlaylistId(Long playlistId);
}
