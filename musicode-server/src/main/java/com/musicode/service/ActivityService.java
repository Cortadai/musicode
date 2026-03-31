package com.musicode.service;

import com.musicode.model.dto.ActivityEvent;
import com.musicode.model.entity.PlaybackEvent;
import com.musicode.model.entity.Track;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Manages SSE connections and broadcasts activity events to all connected clients.
 *
 * WHY CopyOnWriteArrayList for emitters: concurrent iteration during broadcast is frequent,
 * add/remove is infrequent. CopyOnWriteArrayList is optimal for this read-heavy pattern.
 *
 * WHY ConcurrentLinkedDeque for recent: bounded buffer of last 20 events for clients
 * that connect after events were emitted. Lock-free and thread-safe.
 */
@Service
@Slf4j
public class ActivityService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private final ConcurrentLinkedDeque<ActivityEvent> recentEvents = new ConcurrentLinkedDeque<>();
    private static final int MAX_RECENT = 20;

    /**
     * Register a new SSE client. Returns the emitter to be returned from the controller.
     */
    public SseEmitter subscribe() {
        var emitter = new SseEmitter(0L); // No timeout — client manages reconnection

        emitter.onCompletion(() -> {
            emitters.remove(emitter);
            log.debug("[activity] Client disconnected. Active: {}", emitters.size());
        });
        emitter.onTimeout(() -> {
            emitters.remove(emitter);
            emitter.complete();
        });
        emitter.onError(e -> {
            emitters.remove(emitter);
            log.debug("[activity] Client error: {}. Active: {}", e.getMessage(), emitters.size());
        });

        emitters.add(emitter);
        log.debug("[activity] Client connected. Active: {}", emitters.size());
        return emitter;
    }

    /**
     * Broadcast a playback event to all connected SSE clients.
     * Also stores in the recent buffer for late-joining clients.
     */
    public void broadcast(PlaybackEvent event) {
        Track track = event.getTrack();
        var activityEvent = new ActivityEvent(
                event.getUser().getUsername(),
                track.getTitle(),
                track.getArtist() != null ? track.getArtist().getName() : "Unknown",
                track.getAlbum() != null ? track.getAlbum().getTitle() : "Unknown",
                track.getAlbum() != null ? track.getAlbum().getId() : null,
                track.getAlbum() != null && track.getAlbum().isHasCoverArt(),
                event.getPlayedAt()
        );

        // Store in recent buffer
        recentEvents.addFirst(activityEvent);
        while (recentEvents.size() > MAX_RECENT) {
            recentEvents.removeLast();
        }

        // Broadcast to all connected clients
        var deadEmitters = new java.util.ArrayList<SseEmitter>();
        for (var emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("play")
                        .data(activityEvent));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        }
        emitters.removeAll(deadEmitters);

        if (!emitters.isEmpty()) {
            log.debug("[activity] Broadcast to {} clients: {} — {}",
                    emitters.size(), activityEvent.artistName(), activityEvent.trackTitle());
        }
    }

    /**
     * Get the most recent activity events (for clients that connect late).
     */
    public List<ActivityEvent> getRecent() {
        return List.copyOf(recentEvents);
    }

    /**
     * Get the number of connected SSE clients.
     */
    public int getConnectionCount() {
        return emitters.size();
    }
}
