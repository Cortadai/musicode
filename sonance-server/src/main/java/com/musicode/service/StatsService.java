package com.musicode.service;

import com.musicode.model.dto.*;
import com.musicode.model.entity.User;
import com.musicode.repository.PlaybackEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final PlaybackEventRepository playbackEventRepository;

    public List<RecentPlay> getRecentPlays(User user, int limit) {
        return playbackEventRepository.findRecentPlays(user, limit).stream()
                .map(row -> new RecentPlay(
                        (String) row[0],
                        (String) row[1],
                        (String) row[2],
                        (Long) row[3],
                        row[4] != null,
                        (Instant) row[5]
                ))
                .toList();
    }

    public List<TopArtistStat> getTopArtists(User user, String period, int limit) {
        var since = periodToInstant(period);
        return playbackEventRepository.findTopArtists(user, since, limit).stream()
                .map(row -> new TopArtistStat((String) row[0], (long) row[1]))
                .toList();
    }

    public List<TopAlbumStat> getTopAlbums(User user, String period, int limit) {
        var since = periodToInstant(period);
        return playbackEventRepository.findTopAlbums(user, since, limit).stream()
                .map(row -> new TopAlbumStat((String) row[0], (Long) row[1], (String) row[2], (long) row[3]))
                .toList();
    }

    public List<TopTrackStat> getTopTracks(User user, String period, int limit) {
        var since = periodToInstant(period);
        return playbackEventRepository.findTopTracks(user, since, limit).stream()
                .map(row -> new TopTrackStat((String) row[0], (Long) row[1], (String) row[2], (long) row[3]))
                .toList();
    }

    public StatsSummary getSummary(User user, String period) {
        var since = periodToInstant(period);
        var results = playbackEventRepository.findSummary(user, since);
        var row = results.isEmpty() ? new Object[]{0L, 0L, 0L, 0L} : results.get(0);
        return new StatsSummary(
                ((Number) row[0]).longValue(),
                ((Number) row[1]).longValue(),
                ((Number) row[2]).longValue(),
                ((Number) row[3]).longValue()
        );
    }

    public List<DailyPlayCount> getHistory(User user, String period) {
        var since = periodToInstant(period);
        return playbackEventRepository.findDailyPlayCounts(user, since).stream()
                .map(row -> {
                    // H2 returns java.sql.Date from CAST(... AS DATE)
                    var sqlDate = row[0];
                    LocalDate date;
                    if (sqlDate instanceof java.sql.Date d) {
                        date = d.toLocalDate();
                    } else if (sqlDate instanceof LocalDate ld) {
                        date = ld;
                    } else {
                        date = LocalDate.parse(sqlDate.toString());
                    }
                    return new DailyPlayCount(date, (long) row[1]);
                })
                .toList();
    }

    /**
     * Convert a period string to an Instant representing the start of that period.
     * Supported values: week, month, year, all (or null for all-time).
     */
    private Instant periodToInstant(String period) {
        if (period == null || period.isBlank() || "all".equalsIgnoreCase(period)) {
            return Instant.EPOCH;
        }
        return switch (period.toLowerCase()) {
            case "week" -> Instant.now().minus(7, ChronoUnit.DAYS);
            case "month" -> Instant.now().minus(30, ChronoUnit.DAYS);
            case "year" -> Instant.now().minus(365, ChronoUnit.DAYS);
            default -> Instant.EPOCH;
        };
    }
}
