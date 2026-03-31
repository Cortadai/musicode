package com.musicode.service;

import com.musicode.config.LastfmConfig;
import com.musicode.model.entity.Track;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Map;
import java.util.TreeMap;

/**
 * Last.fm scrobble integration.
 * API docs: https://www.last.fm/api/scrobbling
 *
 * Auth flow: auth.getMobileSession (username + password + api_key + api_sig → session key).
 * Session keys are valid indefinitely — stored in User entity.
 *
 * All write methods require an API signature: md5 of alphabetically sorted param keys+values,
 * concatenated, appended with the API secret.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LastfmService {

    private static final String API_URL = "https://ws.audioscrobbler.com/2.0/";
    private final LastfmConfig config;
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Authenticate a Last.fm user with the mobile auth flow.
     *
     * @return session key on success, null on failure
     */
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
            var response = restTemplate.postForEntity(API_URL, request, Map.class);

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

    /**
     * Scrobble a track to Last.fm.
     *
     * @return true if successful
     */
    public boolean scrobble(Track track, String sessionKey, Instant timestamp) {
        if (config.getApiKey().isBlank() || config.getApiSecret().isBlank()) {
            return false;
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
            var response = restTemplate.postForEntity(API_URL, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.debug("[lastfm] Scrobbled: {} — {}", track.getArtist() != null ? track.getArtist().getName() : "?", track.getTitle());
                return true;
            } else {
                log.warn("[lastfm] Scrobble failed: {}", response.getBody());
                return false;
            }
        } catch (Exception e) {
            log.warn("[lastfm] Scrobble error for '{}': {}", track.getTitle(), e.getMessage());
            return false;
        }
    }

    /**
     * Generate Last.fm API signature.
     * Sort params alphabetically, concatenate key+value pairs, append secret, MD5 the result.
     */
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

    /**
     * Check if Last.fm integration is configured (API key present).
     */
    public boolean isConfigured() {
        return !config.getApiKey().isBlank() && !config.getApiSecret().isBlank();
    }
}
