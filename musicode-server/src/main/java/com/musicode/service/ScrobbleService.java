package com.musicode.service;

import com.musicode.model.entity.PlaybackEvent;
import com.musicode.model.entity.Track;
import com.musicode.model.entity.User;
import com.musicode.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Orchestrates scrobbling to all configured services.
 * Runs asynchronously — never blocks the play recording endpoint.
 * Retries with exponential backoff (1s, 2s, 4s) on failure, max 3 attempts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ScrobbleService {

    private final ListenBrainzService listenBrainzService;
    private final LastfmService lastfmService;
    private final TrackRepository trackRepository;

    private static final int MAX_RETRIES = 3;
    private long baseDelayMs = 1000;

    /**
     * Scrobble a playback event to all configured services for the given user.
     * This method is @Async — it runs in a separate thread and never blocks the caller.
     */
    @Async
    public void scrobble(PlaybackEvent event) {
        User user = event.getUser();
        // Reload track with associations (artist, album) to avoid lazy init issues in async context
        Track track = trackRepository.findById(event.getTrack().getId()).orElse(null);
        if (track == null) {
            log.warn("[scrobble] Track not found for event id={}", event.getId());
            return;
        }

        var timestamp = event.getPlayedAt();

        // ListenBrainz
        if (user.getListenbrainzToken() != null && !user.getListenbrainzToken().isBlank()) {
            retryWithBackoff("ListenBrainz", () ->
                    listenBrainzService.submitListen(track, user.getListenbrainzToken(), timestamp));
        }

        // Last.fm
        if (user.getLastfmSessionKey() != null && !user.getLastfmSessionKey().isBlank()) {
            retryWithBackoff("Last.fm", () ->
                    lastfmService.scrobble(track, user.getLastfmSessionKey(), timestamp));
        }
    }

    private void retryWithBackoff(String serviceName, java.util.function.BooleanSupplier action) {
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                if (action.getAsBoolean()) {
                    return; // Success
                }
            } catch (Exception e) {
                log.warn("[scrobble] {} attempt {}/{} threw: {}", serviceName, attempt, MAX_RETRIES, e.getMessage());
            }

            if (attempt < MAX_RETRIES) {
                long delay = baseDelayMs * (1L << (attempt - 1)); // 1s, 2s, 4s
                log.debug("[scrobble] {} retry in {}ms (attempt {}/{})", serviceName, delay, attempt, MAX_RETRIES);
                try {
                    Thread.sleep(delay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }
        log.warn("[scrobble] {} failed after {} attempts", serviceName, MAX_RETRIES);
    }
}
