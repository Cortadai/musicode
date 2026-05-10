package com.musicode.service;

import com.musicode.model.dto.ActivityEvent;
import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.PlaybackEvent;
import com.musicode.model.entity.Track;
import com.musicode.model.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class ActivityServiceTest {

    private ActivityService service;

    @BeforeEach
    void setUp() {
        service = new ActivityService();
    }

    @Test
    void subscribe_returnsLiveEmitterAndIncrementsCount() {
        SseEmitter emitter = service.subscribe();

        assertThat(emitter).isNotNull();
        assertThat(service.getConnectionCount()).isEqualTo(1);
    }

    @Test
    void subscribe_multipleClients_trackedIndependently() {
        service.subscribe();
        service.subscribe();
        service.subscribe();

        assertThat(service.getConnectionCount()).isEqualTo(3);
    }

    @Test
    void broadcast_addsEventToRecentBuffer() {
        service.broadcast(playbackEvent("alice", "Karma Police", "Radiohead", "OK Computer"));

        List<ActivityEvent> recent = service.getRecent();
        assertThat(recent).hasSize(1);
        assertThat(recent.get(0).trackTitle()).isEqualTo("Karma Police");
        assertThat(recent.get(0).artistName()).isEqualTo("Radiohead");
        assertThat(recent.get(0).albumTitle()).isEqualTo("OK Computer");
        assertThat(recent.get(0).username()).isEqualTo("alice");
    }

    @Test
    void broadcast_recentBufferIsNewestFirst() {
        service.broadcast(playbackEvent("u", "first", "A", "X"));
        service.broadcast(playbackEvent("u", "second", "A", "X"));
        service.broadcast(playbackEvent("u", "third", "A", "X"));

        List<ActivityEvent> recent = service.getRecent();
        assertThat(recent).extracting(ActivityEvent::trackTitle)
                .containsExactly("third", "second", "first");
    }

    @Test
    void broadcast_recentBufferCapsAt20() {
        for (int i = 0; i < 25; i++) {
            service.broadcast(playbackEvent("u", "t" + i, "A", "X"));
        }

        List<ActivityEvent> recent = service.getRecent();
        assertThat(recent).hasSize(20);
        // Newest is t24, oldest still in buffer is t5 (t0..t4 evicted)
        assertThat(recent.get(0).trackTitle()).isEqualTo("t24");
        assertThat(recent.get(19).trackTitle()).isEqualTo("t5");
    }

    @Test
    void broadcast_unknownArtistAndAlbumFallbacks() {
        Track t = Track.builder().title("Orphan").build();
        User u = User.builder().username("bob").build();
        PlaybackEvent e = new PlaybackEvent();
        e.setUser(u);
        e.setTrack(t);
        e.setPlayedAt(Instant.ofEpochSecond(1L));

        service.broadcast(e);

        ActivityEvent ev = service.getRecent().get(0);
        assertThat(ev.artistName()).isEqualTo("Unknown");
        assertThat(ev.albumTitle()).isEqualTo("Unknown");
        assertThat(ev.albumId()).isNull();
        assertThat(ev.hasCoverArt()).isFalse();
    }

    @Test
    void broadcast_sendsToAllEmitters() throws Exception {
        SseEmitter e1 = mock(SseEmitter.class);
        SseEmitter e2 = mock(SseEmitter.class);
        injectEmitters(e1, e2);

        service.broadcast(playbackEvent("u", "t", "a", "x"));

        verify(e1, times(1)).send(any(SseEmitter.SseEventBuilder.class));
        verify(e2, times(1)).send(any(SseEmitter.SseEventBuilder.class));
    }

    @Test
    void broadcast_removesEmittersThatThrowIOException() throws Exception {
        SseEmitter alive = mock(SseEmitter.class);
        SseEmitter dead = mock(SseEmitter.class);
        doThrow(new IOException("broken pipe")).when(dead).send(any(SseEmitter.SseEventBuilder.class));
        injectEmitters(alive, dead);

        service.broadcast(playbackEvent("u", "t", "a", "x"));

        assertThat(service.getConnectionCount()).isEqualTo(1);
    }

    @Test
    void broadcast_withNoEmitters_stillRecordsInRecent() {
        assertThat(service.getConnectionCount()).isZero();

        service.broadcast(playbackEvent("u", "silent", "a", "x"));

        assertThat(service.getRecent()).hasSize(1);
        assertThat(service.getRecent().get(0).trackTitle()).isEqualTo("silent");
    }

    @Test
    void getRecent_returnsImmutableCopy() {
        service.broadcast(playbackEvent("u", "t", "a", "x"));
        List<ActivityEvent> recent = service.getRecent();

        assertThat(recent).hasSize(1);
        // Must be an unmodifiable / copied list — not a live view
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> recent.add(null))
                .isInstanceOf(UnsupportedOperationException.class);
    }

    @Test
    void getConnectionCount_zeroOnFreshService() {
        assertThat(service.getConnectionCount()).isZero();
    }

    private PlaybackEvent playbackEvent(String user, String track, String artist, String album) {
        Artist a = new Artist();
        a.setName(artist);
        Album al = new Album();
        al.setId(100L);
        al.setTitle(album);
        al.setHasCoverArt(true);
        Track t = Track.builder().title(track).artist(a).album(al).build();
        User u = User.builder().username(user).build();
        PlaybackEvent e = new PlaybackEvent();
        e.setUser(u);
        e.setTrack(t);
        e.setPlayedAt(Instant.ofEpochSecond(1_700_000_000L));
        return e;
    }

    @SuppressWarnings("unchecked")
    private void injectEmitters(SseEmitter... toAdd) {
        var list = (List<SseEmitter>) ReflectionTestUtils.getField(service, "emitters");
        list.clear();
        for (var e : toAdd) list.add(e);
    }
}
