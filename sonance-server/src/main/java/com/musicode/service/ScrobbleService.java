package com.musicode.service;

import com.musicode.model.dto.ScrobbleResult;
import com.musicode.model.entity.PlaybackEvent;
import com.musicode.model.entity.Track;
import com.musicode.model.entity.User;
import com.musicode.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.function.Supplier;

@Service
@Slf4j
public class ScrobbleService {

    private final ListenBrainzService listenBrainzService;
    private final LastfmService lastfmService;
    private final TrackRepository trackRepository;

    private static final int MAX_RETRIES = 3;
    private final long baseDelayMs;

    public ScrobbleService(
            ListenBrainzService listenBrainzService,
            LastfmService lastfmService,
            TrackRepository trackRepository,
            @org.springframework.beans.factory.annotation.Value("${sonance.scrobble.retry-delay-ms:1000}") long baseDelayMs) {
        this.listenBrainzService = listenBrainzService;
        this.lastfmService = lastfmService;
        this.trackRepository = trackRepository;
        this.baseDelayMs = baseDelayMs;
    }

    @Async
    public void scrobble(PlaybackEvent event) {
        User user = event.getUser();
        Track track = trackRepository.findById(event.getTrack().getId()).orElse(null);
        if (track == null) {
            log.warn("[scrobble] Track not found for event id={}", event.getId());
            return;
        }

        var timestamp = event.getPlayedAt();

        if (user.getListenbrainzToken() != null && !user.getListenbrainzToken().isBlank()) {
            retryWithBackoff("ListenBrainz", () ->
                    listenBrainzService.submitListen(track, user.getListenbrainzToken(), timestamp));
        }

        if (user.getLastfmSessionKey() != null && !user.getLastfmSessionKey().isBlank()) {
            retryWithBackoff("Last.fm", () ->
                    lastfmService.scrobble(track, user.getLastfmSessionKey(), timestamp));
        }
    }

    private void retryWithBackoff(String serviceName, Supplier<ScrobbleResult> action) {
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                ScrobbleResult result = action.get();
                if (result.success()) {
                    return;
                }
                if (!result.isRetryable()) {
                    log.warn("[scrobble] {} non-retryable error ({}): {}", serviceName, result.errorType(), result.message());
                    return;
                }
                log.debug("[scrobble] {} retryable error attempt {}/{}: {}", serviceName, attempt, MAX_RETRIES, result.message());
            } catch (Exception e) {
                log.warn("[scrobble] {} attempt {}/{} threw: {}", serviceName, attempt, MAX_RETRIES, e.getMessage());
            }

            if (attempt < MAX_RETRIES) {
                long delay = baseDelayMs * (1L << (attempt - 1));
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
