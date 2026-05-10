package com.musicode.service;

import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.*;
import com.musicode.repository.TrackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LyricsServiceTest {

    @Mock private TrackRepository trackRepository;
    @Mock private RestTemplate restTemplate;

    @InjectMocks private LyricsService lyricsService;

    private Track track;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(lyricsService, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(lyricsService, "apiUrl", "https://lrclib.net/api");

        Artist artist = Artist.builder().id(1L).name("Radiohead").build();
        Album album = Album.builder().id(1L).title("OK Computer").artist(artist).build();
        track = Track.builder()
                .id(1L)
                .title("Karma Police")
                .artist(artist)
                .album(album)
                .duration(264)
                .lyricsStatus(LyricsStatus.NOT_SEARCHED)
                .build();
    }

    @Test
    void getLyrics_cachedSynced_returnsWithoutApiFetch() {
        track.setLyricsStatus(LyricsStatus.SYNCED);
        track.setSyncedLyrics("[00:00.00] Test line");
        track.setPlainLyrics("Test line");
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));

        var result = lyricsService.getLyrics(1L);

        assertThat(result.getStatus()).isEqualTo(LyricsStatus.SYNCED);
        assertThat(result.getSyncedLyrics()).isEqualTo("[00:00.00] Test line");
        verifyNoInteractions(restTemplate);
    }

    @Test
    void getLyrics_cachedNotFound_returnsWithoutApiFetch() {
        track.setLyricsStatus(LyricsStatus.NOT_FOUND);
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));

        var result = lyricsService.getLyrics(1L);

        assertThat(result.getStatus()).isEqualTo(LyricsStatus.NOT_FOUND);
        verifyNoInteractions(restTemplate);
    }

    @Test
    void getLyrics_notSearched_fetchesSyncedLyrics() {
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
        when(restTemplate.getForObject(anyString(), eq(Map.class)))
                .thenReturn(Map.of(
                        "syncedLyrics", "[00:12.34] Karma police\n[00:18.50] Arrest this man",
                        "plainLyrics", "Karma police\nArrest this man",
                        "instrumental", false
                ));
        when(trackRepository.save(any(Track.class))).thenAnswer(i -> i.getArgument(0));

        var result = lyricsService.getLyrics(1L);

        assertThat(result.getStatus()).isEqualTo(LyricsStatus.SYNCED);
        assertThat(result.getSyncedLyrics()).contains("[00:12.34]");
        assertThat(result.getPlainLyrics()).contains("Karma police");
        verify(trackRepository).save(track);
    }

    @Test
    void getLyrics_plainOnly_setsPlainOnlyStatus() {
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
        when(restTemplate.getForObject(anyString(), eq(Map.class)))
                .thenReturn(Map.of(
                        "plainLyrics", "Karma police\nArrest this man",
                        "instrumental", false
                ));
        when(trackRepository.save(any(Track.class))).thenAnswer(i -> i.getArgument(0));

        var result = lyricsService.getLyrics(1L);

        assertThat(result.getStatus()).isEqualTo(LyricsStatus.PLAIN_ONLY);
        assertThat(result.getPlainLyrics()).contains("Karma police");
        assertThat(result.getSyncedLyrics()).isNull();
    }

    @Test
    void getLyrics_instrumental_setsInstrumentalStatus() {
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
        when(restTemplate.getForObject(anyString(), eq(Map.class)))
                .thenReturn(Map.of("instrumental", true));
        when(trackRepository.save(any(Track.class))).thenAnswer(i -> i.getArgument(0));

        var result = lyricsService.getLyrics(1L);

        assertThat(result.getStatus()).isEqualTo(LyricsStatus.INSTRUMENTAL);
    }

    @Test
    void getLyrics_api404_setsNotFound() {
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
        when(restTemplate.getForObject(anyString(), eq(Map.class)))
                .thenThrow(HttpClientErrorException.create(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Not Found",
                        org.springframework.http.HttpHeaders.EMPTY, new byte[0], null));
        when(trackRepository.save(any(Track.class))).thenAnswer(i -> i.getArgument(0));

        var result = lyricsService.getLyrics(1L);

        assertThat(result.getStatus()).isEqualTo(LyricsStatus.NOT_FOUND);
        verify(trackRepository).save(track);
    }

    @Test
    void getLyrics_timeout_doesNotCache() {
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
        when(restTemplate.getForObject(anyString(), eq(Map.class)))
                .thenThrow(new ResourceAccessException("Connection timed out"));

        var result = lyricsService.getLyrics(1L);

        assertThat(result.getStatus()).isEqualTo(LyricsStatus.NOT_SEARCHED);
        verify(trackRepository, never()).save(any());
    }

    @Test
    void getLyrics_trackNotFound_throwsException() {
        when(trackRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> lyricsService.getLyrics(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getLyrics_missingArtist_setsNotFound() {
        track.setArtist(null);
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
        when(trackRepository.save(any(Track.class))).thenAnswer(i -> i.getArgument(0));

        var result = lyricsService.getLyrics(1L);

        assertThat(result.getStatus()).isEqualTo(LyricsStatus.NOT_FOUND);
        verifyNoInteractions(restTemplate);
    }

    @Test
    void retryLyrics_resetsCacheAndRefetches() {
        track.setLyricsStatus(LyricsStatus.NOT_FOUND);
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
        when(restTemplate.getForObject(anyString(), eq(Map.class)))
                .thenReturn(Map.of(
                        "syncedLyrics", "[00:00.00] New lyrics",
                        "plainLyrics", "New lyrics",
                        "instrumental", false
                ));
        when(trackRepository.save(any(Track.class))).thenAnswer(i -> i.getArgument(0));

        var result = lyricsService.retryLyrics(1L);

        assertThat(result.getStatus()).isEqualTo(LyricsStatus.SYNCED);
        assertThat(result.getSyncedLyrics()).contains("New lyrics");
    }
}
