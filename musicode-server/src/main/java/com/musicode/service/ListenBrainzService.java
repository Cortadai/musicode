package com.musicode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicode.model.entity.Track;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * ListenBrainz scrobble integration.
 * API docs: https://listenbrainz.readthedocs.io/en/latest/users/api/core.html
 *
 * Auth is simple: user provides a token from their ListenBrainz profile page.
 * No OAuth flow — just a bearer token in the Authorization header.
 */
@Service
@Slf4j
public class ListenBrainzService {

    @Value("${musicode.listenbrainz.api-url:https://api.listenbrainz.org/1/submit-listens}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Submit a listen to ListenBrainz.
     *
     * @return true if successful, false on failure
     */
    public boolean submitListen(Track track, String userToken, Instant listenedAt) {
        try {
            Map<String, Object> trackMetadata = Map.of(
                    "artist_name", track.getArtist() != null ? track.getArtist().getName() : "Unknown",
                    "track_name", track.getTitle(),
                    "release_name", track.getAlbum() != null ? track.getAlbum().getTitle() : "Unknown"
            );

            Map<String, Object> listen = Map.of(
                    "listened_at", listenedAt.getEpochSecond(),
                    "track_metadata", trackMetadata
            );

            Map<String, Object> body = Map.of(
                    "listen_type", "single",
                    "payload", List.of(listen)
            );

            // Serialize explicitly to JSON string to avoid RestTemplate converter ambiguity
            // with immutable Map.of() values (observed: empty body sent to server).
            String jsonBody = objectMapper.writeValueAsString(body);

            var headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Token " + userToken);
            headers.set("User-Agent", "Musicode/1.0 (https://github.com/dcortaberria/musicode)");

            var request = new HttpEntity<>(jsonBody, headers);
            var response = restTemplate.postForEntity(apiUrl, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.debug("[listenbrainz] Scrobbled: {} — {}", track.getArtist() != null ? track.getArtist().getName() : "?", track.getTitle());
                return true;
            } else {
                log.warn("[listenbrainz] Unexpected status {}: {}", response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (Exception e) {
            log.warn("[listenbrainz] Failed to scrobble '{}': {}", track.getTitle(), e.getMessage());
            return false;
        }
    }
}
