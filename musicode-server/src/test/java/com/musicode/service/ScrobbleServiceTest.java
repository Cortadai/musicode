package com.musicode.service;

import com.musicode.model.dto.ScrobbleResult;
import com.musicode.model.dto.ScrobbleResult.ErrorType;
import com.musicode.model.entity.PlaybackEvent;
import com.musicode.model.entity.Track;
import com.musicode.model.entity.User;
import com.musicode.repository.TrackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class ScrobbleServiceTest {

    private LastfmService lastfm;
    private ListenBrainzService listenBrainz;
    private TrackRepository trackRepository;
    private ScrobbleService service;

    private Track track;
    private User user;
    private PlaybackEvent event;
    private Instant playedAt;

    @BeforeEach
    void setUp() {
        lastfm = mock(LastfmService.class);
        listenBrainz = mock(ListenBrainzService.class);
        trackRepository = mock(TrackRepository.class);
        service = new ScrobbleService(listenBrainz, lastfm, trackRepository);
        ReflectionTestUtils.setField(service, "baseDelayMs", 1L);

        track = Track.builder().id(1L).title("Karma Police").build();
        user = User.builder().id(7L).username("alice").build();
        playedAt = Instant.ofEpochSecond(1_700_000_000L);

        event = new PlaybackEvent();
        event.setId(99L);
        event.setUser(user);
        event.setTrack(track);
        event.setPlayedAt(playedAt);

        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));
    }

    @Test
    void scrobble_noProvidersConfigured_callsNeither() {
        service.scrobble(event);

        verifyNoInteractions(lastfm);
        verifyNoInteractions(listenBrainz);
    }

    @Test
    void scrobble_onlyListenBrainzConfigured_callsOnlyListenBrainz() {
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(eq(track), eq("lb-token"), eq(playedAt))).thenReturn(ScrobbleResult.ok());

        service.scrobble(event);

        verify(listenBrainz, times(1)).submitListen(track, "lb-token", playedAt);
        verifyNoInteractions(lastfm);
    }

    @Test
    void scrobble_onlyLastfmConfigured_callsOnlyLastfm() {
        user.setLastfmSessionKey("sk-abc");
        when(lastfm.scrobble(eq(track), eq("sk-abc"), eq(playedAt))).thenReturn(ScrobbleResult.ok());

        service.scrobble(event);

        verify(lastfm, times(1)).scrobble(track, "sk-abc", playedAt);
        verifyNoInteractions(listenBrainz);
    }

    @Test
    void scrobble_bothConfigured_callsBoth() {
        user.setListenbrainzToken("lb-token");
        user.setLastfmSessionKey("sk-abc");
        when(listenBrainz.submitListen(any(), any(), any())).thenReturn(ScrobbleResult.ok());
        when(lastfm.scrobble(any(), any(), any())).thenReturn(ScrobbleResult.ok());

        service.scrobble(event);

        verify(listenBrainz, times(1)).submitListen(track, "lb-token", playedAt);
        verify(lastfm, times(1)).scrobble(track, "sk-abc", playedAt);
    }

    @Test
    void scrobble_blankTokenTreatedAsUnconfigured() {
        user.setListenbrainzToken("   ");
        user.setLastfmSessionKey("");

        service.scrobble(event);

        verifyNoInteractions(lastfm);
        verifyNoInteractions(listenBrainz);
    }

    @Test
    void scrobble_trackNotFound_skipsProviders() {
        when(trackRepository.findById(1L)).thenReturn(Optional.empty());
        user.setListenbrainzToken("lb-token");
        user.setLastfmSessionKey("sk-abc");

        service.scrobble(event);

        verifyNoInteractions(lastfm);
        verifyNoInteractions(listenBrainz);
    }

    @Test
    void scrobble_listenBrainzSuccessFirstTry_noRetry() {
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(any(), any(), any())).thenReturn(ScrobbleResult.ok());

        service.scrobble(event);

        verify(listenBrainz, times(1)).submitListen(track, "lb-token", playedAt);
    }

    @Test
    void scrobble_retryableError_retriesWithBackoff() {
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(any(), any(), any()))
                .thenReturn(ScrobbleResult.error(ErrorType.TIMEOUT, "timed out"))
                .thenReturn(ScrobbleResult.error(ErrorType.SERVER_ERROR, "503"))
                .thenReturn(ScrobbleResult.ok());

        service.scrobble(event);

        verify(listenBrainz, times(3)).submitListen(track, "lb-token", playedAt);
    }

    @Test
    void scrobble_authError_noRetry() {
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(any(), any(), any()))
                .thenReturn(ScrobbleResult.error(ErrorType.AUTH_ERROR, "Invalid token"));

        service.scrobble(event);

        verify(listenBrainz, times(1)).submitListen(track, "lb-token", playedAt);
    }

    @Test
    void scrobble_configError_noRetry() {
        user.setLastfmSessionKey("sk-abc");
        when(lastfm.scrobble(any(), any(), any()))
                .thenReturn(ScrobbleResult.error(ErrorType.CONFIG_ERROR, "API key not configured"));

        service.scrobble(event);

        verify(lastfm, times(1)).scrobble(track, "sk-abc", playedAt);
    }

    @Test
    void scrobble_retryableAlwaysFails_exhaustsAfter3Attempts() {
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(any(), any(), any()))
                .thenReturn(ScrobbleResult.error(ErrorType.TIMEOUT, "timed out"));

        service.scrobble(event);

        verify(listenBrainz, times(3)).submitListen(track, "lb-token", playedAt);
    }

    @Test
    void scrobble_exceptionStillRetries() {
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(any(), any(), any()))
                .thenThrow(new RuntimeException("network failure"));

        service.scrobble(event);

        verify(listenBrainz, times(3)).submitListen(track, "lb-token", playedAt);
    }

    @Test
    void scrobble_lastfmFailsOnceThenSucceeds() {
        user.setLastfmSessionKey("sk-abc");
        when(lastfm.scrobble(any(), any(), any()))
                .thenReturn(ScrobbleResult.error(ErrorType.SERVER_ERROR, "500"))
                .thenReturn(ScrobbleResult.ok());

        service.scrobble(event);

        verify(lastfm, times(2)).scrobble(track, "sk-abc", playedAt);
    }

    @Test
    void scrobble_independentRetriesPerProvider() {
        user.setListenbrainzToken("lb-token");
        user.setLastfmSessionKey("sk-abc");
        when(listenBrainz.submitListen(any(), any(), any()))
                .thenReturn(ScrobbleResult.error(ErrorType.AUTH_ERROR, "bad token"));
        when(lastfm.scrobble(any(), any(), any())).thenReturn(ScrobbleResult.ok());

        service.scrobble(event);

        verify(listenBrainz, times(1)).submitListen(track, "lb-token", playedAt);
        verify(lastfm, times(1)).scrobble(track, "sk-abc", playedAt);
    }

    @Test
    void scrobble_usesReloadedTrackNotEventTrack() {
        Track hydrated = Track.builder().id(1L).title("Karma Police (full)").build();
        when(trackRepository.findById(1L)).thenReturn(Optional.of(hydrated));
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(eq(hydrated), any(), any())).thenReturn(ScrobbleResult.ok());

        service.scrobble(event);

        verify(listenBrainz).submitListen(hydrated, "lb-token", playedAt);
        verify(listenBrainz, never()).submitListen(track, "lb-token", playedAt);
    }
}
