package com.musicode.service;

import com.musicode.model.entity.User;
import com.musicode.repository.PlaybackEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class StatsServiceTest {

    private PlaybackEventRepository repo;
    private StatsService service;
    private User user;

    @BeforeEach
    void setUp() {
        repo = mock(PlaybackEventRepository.class);
        service = new StatsService(repo);
        user = new User();
        user.setId(42L);
        user.setUsername("tester");
    }

    @Test
    void getTopArtists_mapsRowsToDtos() {
        when(repo.findTopArtists(eq(user), any(Instant.class), eq(5))).thenReturn(List.<Object[]>of(
                new Object[]{"Radiohead", 12L},
                new Object[]{"Pixies", 7L}
        ));

        var result = service.getTopArtists(user, "month", 5);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).name()).isEqualTo("Radiohead");
        assertThat(result.get(0).playCount()).isEqualTo(12L);
        assertThat(result.get(1).name()).isEqualTo("Pixies");
        assertThat(result.get(1).playCount()).isEqualTo(7L);
    }

    @Test
    void getTopAlbums_mapsRowsToDtos() {
        when(repo.findTopAlbums(eq(user), any(Instant.class), eq(3))).thenReturn(List.<Object[]>of(
                new Object[]{"OK Computer", 10L, "Radiohead", 20L}
        ));

        var result = service.getTopAlbums(user, "week", 3);

        assertThat(result).hasSize(1);
        var album = result.get(0);
        assertThat(album.title()).isEqualTo("OK Computer");
        assertThat(album.albumId()).isEqualTo(10L);
        assertThat(album.artistName()).isEqualTo("Radiohead");
        assertThat(album.playCount()).isEqualTo(20L);
    }

    @Test
    void getTopTracks_mapsRowsToDtos() {
        when(repo.findTopTracks(eq(user), any(Instant.class), eq(10))).thenReturn(List.<Object[]>of(
                new Object[]{"Paranoid Android", 99L, "Radiohead", 4L}
        ));

        var result = service.getTopTracks(user, "year", 10);

        assertThat(result).hasSize(1);
        var track = result.get(0);
        assertThat(track.title()).isEqualTo("Paranoid Android");
        assertThat(track.trackId()).isEqualTo(99L);
        assertThat(track.artistName()).isEqualTo("Radiohead");
        assertThat(track.playCount()).isEqualTo(4L);
    }

    @Test
    void getSummary_emptyResult_returnsZeros() {
        when(repo.findSummary(eq(user), any(Instant.class))).thenReturn(List.<Object[]>of());

        var summary = service.getSummary(user, "all");

        assertThat(summary.totalPlays()).isZero();
        assertThat(summary.totalListeningSec()).isZero();
        assertThat(summary.uniqueArtists()).isZero();
        assertThat(summary.uniqueAlbums()).isZero();
    }

    @Test
    void getSummary_mapsNumericRow() {
        when(repo.findSummary(eq(user), any(Instant.class))).thenReturn(List.<Object[]>of(
                new Object[]{150L, 54321L, 8L, 15L}
        ));

        var summary = service.getSummary(user, "month");

        assertThat(summary.totalPlays()).isEqualTo(150L);
        assertThat(summary.totalListeningSec()).isEqualTo(54321L);
        assertThat(summary.uniqueArtists()).isEqualTo(8L);
        assertThat(summary.uniqueAlbums()).isEqualTo(15L);
    }

    @Test
    void getSummary_coercesBigIntegerLikeNumbers() {
        when(repo.findSummary(eq(user), any(Instant.class))).thenReturn(List.<Object[]>of(
                new Object[]{java.math.BigInteger.valueOf(5), java.math.BigInteger.valueOf(100),
                        java.math.BigInteger.valueOf(2), java.math.BigInteger.valueOf(3)}
        ));

        var summary = service.getSummary(user, "week");

        assertThat(summary.totalPlays()).isEqualTo(5L);
        assertThat(summary.totalListeningSec()).isEqualTo(100L);
    }

    @Test
    void getHistory_sqlDateRow_parsesToLocalDate() {
        java.sql.Date day = java.sql.Date.valueOf("2026-04-10");
        when(repo.findDailyPlayCounts(eq(user), any(Instant.class))).thenReturn(List.<Object[]>of(
                new Object[]{day, 3L}
        ));

        var history = service.getHistory(user, "week");

        assertThat(history).hasSize(1);
        assertThat(history.get(0).date()).isEqualTo(LocalDate.of(2026, 4, 10));
        assertThat(history.get(0).count()).isEqualTo(3L);
    }

    @Test
    void getHistory_localDateRow_passesThrough() {
        LocalDate day = LocalDate.of(2026, 1, 15);
        when(repo.findDailyPlayCounts(eq(user), any(Instant.class))).thenReturn(List.<Object[]>of(
                new Object[]{day, 7L}
        ));

        var history = service.getHistory(user, "year");

        assertThat(history).hasSize(1);
        assertThat(history.get(0).date()).isEqualTo(day);
        assertThat(history.get(0).count()).isEqualTo(7L);
    }

    @Test
    void getHistory_stringRow_parsed() {
        when(repo.findDailyPlayCounts(eq(user), any(Instant.class))).thenReturn(List.<Object[]>of(
                new Object[]{"2026-02-20", 1L}
        ));

        var history = service.getHistory(user, "all");

        assertThat(history).hasSize(1);
        assertThat(history.get(0).date()).isEqualTo(LocalDate.of(2026, 2, 20));
    }

    @Test
    void getHistory_emptyRows_returnsEmptyList() {
        when(repo.findDailyPlayCounts(eq(user), any(Instant.class))).thenReturn(List.<Object[]>of());

        assertThat(service.getHistory(user, "month")).isEmpty();
    }

    @Test
    void period_null_blank_all_resolveToEpoch() {
        assertSincePassedToRepo(null).isEqualTo(Instant.EPOCH);
        assertSincePassedToRepo("").isEqualTo(Instant.EPOCH);
        assertSincePassedToRepo("   ").isEqualTo(Instant.EPOCH);
        assertSincePassedToRepo("all").isEqualTo(Instant.EPOCH);
        assertSincePassedToRepo("ALL").isEqualTo(Instant.EPOCH);
    }

    @Test
    void period_unknown_resolvesToEpoch() {
        assertSincePassedToRepo("decade").isEqualTo(Instant.EPOCH);
    }

    @Test
    void period_week_month_year_resolveToRecentInstant() {
        var now = Instant.now();

        var week = captureSince("week");
        assertThat(week).isBetween(now.minus(8, ChronoUnit.DAYS), now.minus(6, ChronoUnit.DAYS));

        var month = captureSince("month");
        assertThat(month).isBetween(now.minus(31, ChronoUnit.DAYS), now.minus(29, ChronoUnit.DAYS));

        var year = captureSince("year");
        assertThat(year).isBetween(now.minus(366, ChronoUnit.DAYS), now.minus(364, ChronoUnit.DAYS));
    }

    private org.assertj.core.api.AbstractInstantAssert<?> assertSincePassedToRepo(String period) {
        return assertThat(captureSince(period));
    }

    private Instant captureSince(String period) {
        var freshRepo = mock(PlaybackEventRepository.class);
        when(freshRepo.findTopArtists(any(), any(Instant.class), anyInt())).thenReturn(List.<Object[]>of());
        new StatsService(freshRepo).getTopArtists(user, period, 1);

        ArgumentCaptor<Instant> captor = ArgumentCaptor.forClass(Instant.class);
        verify(freshRepo).findTopArtists(eq(user), captor.capture(), eq(1));
        return captor.getValue();
    }
}
