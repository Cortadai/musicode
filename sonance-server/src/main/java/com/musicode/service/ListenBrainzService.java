package com.musicode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicode.model.dto.ScrobbleResult;
import com.musicode.model.dto.ScrobbleResult.ErrorType;
import com.musicode.model.entity.Track;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ListenBrainzService {

    @Value("${sonance.listenbrainz.api-url:https://api.listenbrainz.org/1/submit-listens}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ScrobbleResult submitListen(Track track, String userToken, Instant listenedAt) {
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

            String jsonBody = objectMapper.writeValueAsString(body);

            var headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Token " + userToken);
            headers.set("User-Agent", "Musicode/1.0 (https://github.com/dcortaberria/musicode)");

            var request = new HttpEntity<>(jsonBody, headers);
            var response = restTemplate.postForEntity(apiUrl, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.debug("[listenbrainz] Scrobbled: {} — {}", track.getArtist() != null ? track.getArtist().getName() : "?", track.getTitle());
                return ScrobbleResult.ok();
            } else {
                log.warn("[listenbrainz] Unexpected status {}: {}", response.getStatusCode(), response.getBody());
                return ScrobbleResult.error(ErrorType.SERVER_ERROR, "Unexpected status: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED || e.getStatusCode() == HttpStatus.FORBIDDEN) {
                log.warn("[listenbrainz] LB_AUTH_ERROR scrobble '{}': {} {}", track.getTitle(), e.getStatusCode(), e.getMessage());
                return ScrobbleResult.error(ErrorType.AUTH_ERROR, "Auth rejected: " + e.getStatusCode());
            }
            log.warn("[listenbrainz] LB_CLIENT_ERROR scrobble '{}': {} {}", track.getTitle(), e.getStatusCode(), e.getMessage());
            return ScrobbleResult.error(ErrorType.UNKNOWN, "Client error: " + e.getStatusCode());
        } catch (HttpServerErrorException e) {
            log.warn("[listenbrainz] LB_SERVER_ERROR scrobble '{}': {} {}", track.getTitle(), e.getStatusCode(), e.getMessage());
            return ScrobbleResult.error(ErrorType.SERVER_ERROR, "Server error: " + e.getStatusCode());
        } catch (ResourceAccessException e) {
            log.warn("[listenbrainz] LB_TIMEOUT scrobble '{}': {}", track.getTitle(), e.getMessage());
            return ScrobbleResult.error(ErrorType.TIMEOUT, e.getMessage());
        } catch (Exception e) {
            log.warn("[listenbrainz] LB_UNKNOWN_ERROR scrobble '{}': {}", track.getTitle(), e.getMessage());
            return ScrobbleResult.error(ErrorType.UNKNOWN, e.getMessage());
        }
    }
}
