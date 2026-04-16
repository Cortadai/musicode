package com.musicode.service;

import com.musicode.model.entity.PlaybackEvent;
import com.musicode.model.entity.Track;
import com.musicode.model.entity.User;
import com.musicode.repository.TrackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
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
        // Shrink backoff so tests don't sleep for seconds
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
        when(listenBrainz.submitListen(eq(track), eq("lb-token"), eq(playedAt))).thenReturn(true);

        service.scrobble(event);

        verify(listenBrainz, times(1)).submitListen(track, "lb-token", playedAt);
        verifyNoInteractions(lastfm);
    }

    @Test
    void scrobble_onlyLastfmConfigured_callsOnlyLastfm() {
        user.setLastfmSessionKey("sk-abc");
        when(lastfm.scrobble(eq(track), eq("sk-abc"), eq(playedAt))).thenReturn(true);

        service.scrobble(event);

        verify(lastfm, times(1)).scrobble(track, "sk-abc", playedAt);
        verifyNoInteractions(listenBrainz);
    }

    @Test
    void scrobble_bothConfigured_callsBoth() {
        user.setListenbrainzToken("lb-token");
        user.setLastfmSessionKey("sk-abc");
        when(listenBrainz.submitListen(any(), any(), any())).thenReturn(true);
        when(lastfm.scrobble(any(), any(), any())).thenReturn(true);

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
        when(listenBrainz.submitListen(any(), any(), any())).thenReturn(true);

        service.scrobble(event);

        verify(listenBrainz, times(1)).submitListen(track, "lb-token", playedAt);
    }

    @Test
    void scrobble_listenBrainzFailsTwiceThenSucceeds_retriesAndStops() {
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(any(), any(), any()))
                .thenReturn(false)
                .thenReturn(false)
                .thenReturn(true);

        service.scrobble(event);

        verify(listenBrainz, times(3)).submitListen(track, "lb-token", playedAt);
    }

    @Test
    void scrobble_listenBrainzAlwaysFalse_exhaustsAfter3Attempts() {
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(any(), any(), any())).thenReturn(false);

        service.scrobble(event);

        verify(listenBrainz, times(3)).submitListen(track, "lb-token", playedAt);
    }

    @Test
    void scrobble_listenBrainzAlwaysThrows_neverBubblesUp() {
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(any(), any(), any()))
                .thenThrow(new RuntimeException("network failure"));

        // must not throw
        service.scrobble(event);

        verify(listenBrainz, times(3)).submitListen(track, "lb-token", playedAt);
    }

    @Test
    void scrobble_lastfmFailsOnceThenSucceeds_retriesThenStops() {
        user.setLastfmSessionKey("sk-abc");
        when(lastfm.scrobble(any(), any(), any()))
                .thenReturn(false)
                .thenReturn(true);

        service.scrobble(event);

        verify(lastfm, times(2)).scrobble(track, "sk-abc", playedAt);
    }

    @Test
    void scrobble_lastfmAlwaysFalse_exhaustsAfter3Attempts() {
        user.setLastfmSessionKey("sk-abc");
        when(lastfm.scrobble(any(), any(), any())).thenReturn(false);

        service.scrobble(event);

        verify(lastfm, times(3)).scrobble(track, "sk-abc", playedAt);
    }

    @Test
    void scrobble_independentRetriesPerProvider_listenBrainzFailureDoesNotAffectLastfm() {
        user.setListenbrainzToken("lb-token");
        user.setLastfmSessionKey("sk-abc");
        when(listenBrainz.submitListen(any(), any(), any())).thenReturn(false); // always fails
        when(lastfm.scrobble(any(), any(), any())).thenReturn(true); // first try succeeds

        service.scrobble(event);

        verify(listenBrainz, times(3)).submitListen(track, "lb-token", playedAt);
        verify(lastfm, times(1)).scrobble(track, "sk-abc", playedAt);
    }

    @Test
    void scrobble_usesReloadedTrackNotEventTrack() {
        // event carries a stub track; repository returns a fully hydrated one
        Track hydrated = Track.builder().id(1L).title("Karma Police (full)").build();
        when(trackRepository.findById(1L)).thenReturn(Optional.of(hydrated));
        user.setListenbrainzToken("lb-token");
        when(listenBrainz.submitListen(eq(hydrated), any(), any())).thenReturn(true);

        service.scrobble(event);

        verify(listenBrainz).submitListen(hydrated, "lb-token", playedAt);
        verify(listenBrainz, never()).submitListen(track, "lb-token", playedAt);
    }
}
