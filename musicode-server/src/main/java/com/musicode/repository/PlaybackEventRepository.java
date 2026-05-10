package com.musicode.repository;

import com.musicode.model.entity.PlaybackEvent;
import com.musicode.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

public interface PlaybackEventRepository extends JpaRepository<PlaybackEvent, Long> {

    void deleteByTrackIdIn(Collection<Long> trackIds);

    // --- Top artists ---
    @Query("""
            SELECT t.artist.name AS name, COUNT(pe) AS playCount
            FROM PlaybackEvent pe JOIN pe.track t
            WHERE pe.user = :user AND pe.playedAt >= :since
            GROUP BY t.artist.name
            ORDER BY COUNT(pe) DESC
            LIMIT :limit
            """)
    List<Object[]> findTopArtists(User user, Instant since, int limit);

    // --- Top albums ---
    @Query("""
            SELECT t.album.title AS name, t.album.id AS albumId, MIN(t.album.artist.name) AS artistName, COUNT(pe) AS playCount
            FROM PlaybackEvent pe JOIN pe.track t
            WHERE pe.user = :user AND pe.playedAt >= :since
            GROUP BY t.album.id, t.album.title
            ORDER BY COUNT(pe) DESC
            LIMIT :limit
            """)
    List<Object[]> findTopAlbums(User user, Instant since, int limit);

    // --- Top tracks ---
    @Query("""
            SELECT t.title AS name, t.id AS trackId, t.artist.name AS artistName, COUNT(pe) AS playCount
            FROM PlaybackEvent pe JOIN pe.track t
            WHERE pe.user = :user AND pe.playedAt >= :since
            GROUP BY t.title, t.id, t.artist.name
            ORDER BY COUNT(pe) DESC
            LIMIT :limit
            """)
    List<Object[]> findTopTracks(User user, Instant since, int limit);

    // --- Summary ---
    @Query("""
            SELECT COUNT(pe),
                   COALESCE(SUM(pe.listenDurationSec), 0),
                   COUNT(DISTINCT t.artist.id),
                   COUNT(DISTINCT t.album.id)
            FROM PlaybackEvent pe JOIN pe.track t
            WHERE pe.user = :user AND pe.playedAt >= :since
            """)
    List<Object[]> findSummary(User user, Instant since);

    // --- Recent plays (user-scoped) ---
    @Query("""
            SELECT t.title, t.artist.name, t.album.title, t.album.id, t.album.coverArtPath, pe.playedAt
            FROM PlaybackEvent pe JOIN pe.track t
            WHERE pe.user = :user
            ORDER BY pe.playedAt DESC
            LIMIT :limit
            """)
    List<Object[]> findRecentPlays(User user, int limit);

    // --- Daily play counts (for charting) ---
    @Query("""
            SELECT CAST(pe.playedAt AS DATE) AS day, COUNT(pe)
            FROM PlaybackEvent pe
            WHERE pe.user = :user AND pe.playedAt >= :since
            GROUP BY CAST(pe.playedAt AS DATE)
            ORDER BY day ASC
            """)
    List<Object[]> findDailyPlayCounts(User user, Instant since);
}
