package com.musicode.service;

import com.musicode.config.LastfmConfig;
import com.musicode.model.dto.ScrobbleResult;
import com.musicode.model.dto.ScrobbleResult.ErrorType;
import com.musicode.model.entity.Track;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class LastfmService {

    @Value("${musicode.lastfm.api-url:https://ws.audioscrobbler.com/2.0/}")
    private String apiUrl;

    private final LastfmConfig config;
    private final RestTemplate restTemplate = new RestTemplate();

    public String authenticate(String username, String password) {
        if (config.getApiKey().isBlank() || config.getApiSecret().isBlank()) {
            log.warn("[lastfm] API key or secret not configured");
            return null;
        }

        try {
            var params = new TreeMap<String, String>();
            params.put("method", "auth.getMobileSession");
            params.put("username", username);
            params.put("password", password);
            params.put("api_key", config.getApiKey());

            String apiSig = generateSignature(params);
            params.put("api_sig", apiSig);
            params.put("format", "json");

            var form = new LinkedMultiValueMap<String, String>();
            params.forEach(form::add);

            var headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            var request = new HttpEntity<>(form, headers);
            var response = restTemplate.postForEntity(apiUrl, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                var session = (Map<?, ?>) response.getBody().get("session");
                if (session != null && session.get("key") != null) {
                    String key = session.get("key").toString();
                    log.info("[lastfm] Authenticated user '{}' successfully", username);
                    return key;
                }
            }

            log.warn("[lastfm] Auth failed for '{}': {}", username, response.getBody());
            return null;
        } catch (Exception e) {
            log.warn("[lastfm] Auth error for '{}': {}", username, e.getMessage());
            return null;
        }
    }

    public ScrobbleResult scrobble(Track track, String sessionKey, Instant timestamp) {
        if (config.getApiKey().isBlank() || config.getApiSecret().isBlank()) {
            return ScrobbleResult.error(ErrorType.CONFIG_ERROR, "Last.fm API key or secret not configured");
        }

        try {
            var params = new TreeMap<String, String>();
            params.put("method", "track.scrobble");
            params.put("artist", track.getArtist() != null ? track.getArtist().getName() : "Unknown");
            params.put("track", track.getTitle());
            params.put("timestamp", String.valueOf(timestamp.getEpochSecond()));
            params.put("api_key", config.getApiKey());
            params.put("sk", sessionKey);

            if (track.getAlbum() != null) {
                params.put("album", track.getAlbum().getTitle());
            }
            if (track.getDuration() != null) {
                params.put("duration", String.valueOf(track.getDuration()));
            }

            String apiSig = generateSignature(params);
            params.put("api_sig", apiSig);
            params.put("format", "json");

            var form = new LinkedMultiValueMap<String, String>();
            params.forEach(form::add);

            var headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            var request = new HttpEntity<>(form, headers);
            var response = restTemplate.postForEntity(apiUrl, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.debug("[lastfm] Scrobbled: {} — {}", track.getArtist() != null ? track.getArtist().getName() : "?", track.getTitle());
                return ScrobbleResult.ok();
            } else {
                log.warn("[lastfm] Scrobble unexpected status {}: {}", response.getStatusCode(), response.getBody());
                return ScrobbleResult.error(ErrorType.SERVER_ERROR, "Unexpected status: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED || e.getStatusCode() == HttpStatus.FORBIDDEN) {
                log.warn("[lastfm] LASTFM_AUTH_ERROR scrobble '{}': {} {}", track.getTitle(), e.getStatusCode(), e.getMessage());
                return ScrobbleResult.error(ErrorType.AUTH_ERROR, "Auth rejected: " + e.getStatusCode());
            }
            log.warn("[lastfm] LASTFM_CLIENT_ERROR scrobble '{}': {} {}", track.getTitle(), e.getStatusCode(), e.getMessage());
            return ScrobbleResult.error(ErrorType.UNKNOWN, "Client error: " + e.getStatusCode());
        } catch (HttpServerErrorException e) {
            log.warn("[lastfm] LASTFM_SERVER_ERROR scrobble '{}': {} {}", track.getTitle(), e.getStatusCode(), e.getMessage());
            return ScrobbleResult.error(ErrorType.SERVER_ERROR, "Server error: " + e.getStatusCode());
        } catch (ResourceAccessException e) {
            log.warn("[lastfm] LASTFM_TIMEOUT scrobble '{}': {}", track.getTitle(), e.getMessage());
            return ScrobbleResult.error(ErrorType.TIMEOUT, e.getMessage());
        } catch (Exception e) {
            log.warn("[lastfm] LASTFM_UNKNOWN_ERROR scrobble '{}': {}", track.getTitle(), e.getMessage());
            return ScrobbleResult.error(ErrorType.UNKNOWN, e.getMessage());
        }
    }

    private String generateSignature(Map<String, String> params) {
        var sb = new StringBuilder();
        new TreeMap<>(params).forEach((k, v) -> sb.append(k).append(v));
        sb.append(config.getApiSecret());

        try {
            var md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(sb.toString().getBytes(StandardCharsets.UTF_8));
            var hex = new StringBuilder();
            for (byte b : digest) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("MD5 not available", e);
        }
    }

    public boolean isConfigured() {
        return !config.getApiKey().isBlank() && !config.getApiSecret().isBlank();
    }
}
