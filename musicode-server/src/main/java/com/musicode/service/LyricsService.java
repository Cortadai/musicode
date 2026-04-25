package com.musicode.service;

import com.musicode.model.dto.LyricsResponse;
import com.musicode.model.entity.LyricsStatus;
import com.musicode.model.entity.Track;
import com.musicode.repository.TrackRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
@Slf4j
public class LyricsService {

    private final TrackRepository trackRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${musicode.lyrics.api-url:https://lrclib.net/api}")
    private String apiUrl;

    public LyricsService(TrackRepository trackRepository) {
        this.trackRepository = trackRepository;
    }

    public LyricsResponse getLyrics(Long trackId) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new com.musicode.exception.ResourceNotFoundException("Track not found: " + trackId));

        if (track.getLyricsStatus() != LyricsStatus.NOT_SEARCHED) {
            return toResponse(track);
        }

        fetchAndCache(track);
        return toResponse(track);
    }

    public LyricsResponse retryLyrics(Long trackId) {
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new com.musicode.exception.ResourceNotFoundException("Track not found: " + trackId));

        track.setLyricsStatus(LyricsStatus.NOT_SEARCHED);
        fetchAndCache(track);
        return toResponse(track);
    }

    @SuppressWarnings("unchecked")
    void fetchAndCache(Track track) {
        String artistName = track.getArtist() != null ? track.getArtist().getName() : null;
        String albumName = track.getAlbum() != null ? track.getAlbum().getTitle() : null;

        if (artistName == null || track.getTitle() == null) {
            log.warn("[lyrics] Cannot search — missing artist or title for track {}", track.getId());
            track.setLyricsStatus(LyricsStatus.NOT_FOUND);
            trackRepository.save(track);
            return;
        }

        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiUrl + "/get")
                    .queryParam("track_name", track.getTitle())
                    .queryParam("artist_name", artistName);

            if (albumName != null) {
                builder.queryParam("album_name", albumName);
            }
            if (track.getDuration() != null) {
                builder.queryParam("duration", track.getDuration());
            }

            String url = builder.build().toUriString();
            log.debug("[lyrics] Searching LRCLIB for '{}' by '{}'", track.getTitle(), artistName);

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null) {
                track.setLyricsStatus(LyricsStatus.NOT_FOUND);
            } else {
                boolean instrumental = Boolean.TRUE.equals(response.get("instrumental"));
                String synced = (String) response.get("syncedLyrics");
                String plain = (String) response.get("plainLyrics");

                if (instrumental) {
                    track.setLyricsStatus(LyricsStatus.INSTRUMENTAL);
                } else if (synced != null && !synced.isBlank()) {
                    track.setSyncedLyrics(synced);
                    track.setPlainLyrics(plain);
                    track.setLyricsStatus(LyricsStatus.SYNCED);
                } else if (plain != null && !plain.isBlank()) {
                    track.setPlainLyrics(plain);
                    track.setLyricsStatus(LyricsStatus.PLAIN_ONLY);
                } else {
                    track.setLyricsStatus(LyricsStatus.NOT_FOUND);
                }
            }

            trackRepository.save(track);
            log.info("[lyrics] {} — '{}' by '{}'", track.getLyricsStatus(), track.getTitle(), artistName);

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                track.setLyricsStatus(LyricsStatus.NOT_FOUND);
                trackRepository.save(track);
                log.info("[lyrics] NOT_FOUND — '{}' by '{}'", track.getTitle(), artistName);
            } else {
                log.warn("[lyrics] LRCLIB HTTP error {} for '{}': {}", e.getStatusCode(), track.getTitle(), e.getMessage());
            }
        } catch (ResourceAccessException e) {
            log.warn("[lyrics] LRCLIB timeout/connection error for '{}': {}", track.getTitle(), e.getMessage());
        } catch (Exception e) {
            log.warn("[lyrics] Unexpected error fetching lyrics for '{}': {}", track.getTitle(), e.getMessage());
        }
    }

    private LyricsResponse toResponse(Track track) {
        return LyricsResponse.builder()
                .trackId(track.getId())
                .status(track.getLyricsStatus())
                .syncedLyrics(track.getSyncedLyrics())
                .plainLyrics(track.getPlainLyrics())
                .build();
    }
}
