package com.musicode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicode.model.dto.ScrobbleResult;
import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.Track;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ListenBrainzServiceTest {

    private static final String API_URL = "https://api.listenbrainz.org/1/submit-listens";

    private RestTemplate restTemplate;
    private ListenBrainzService service;

    @BeforeEach
    void setUp() {
        restTemplate = mock(RestTemplate.class);
        service = new ListenBrainzService();
        ReflectionTestUtils.setField(service, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(service, "apiUrl", API_URL);
    }

    @Test
    void submitListen_returnsOkOn2xx() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("{\"status\":\"ok\"}"));

        ScrobbleResult result = service.submitListen(fullTrack(), "lb-token-123", Instant.ofEpochSecond(1_700_000_000L));

        assertThat(result.success()).isTrue();
    }

    @Test
    void submitListen_returnsErrorOnNon2xx() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"code\":401}"));

        ScrobbleResult result = service.submitListen(fullTrack(), "bad-token", Instant.ofEpochSecond(1L));

        assertThat(result.success()).isFalse();
    }

    @Test
    void submitListen_returnsUnknownErrorOnException() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(String.class)))
                .thenThrow(new RestClientException("connection refused"));

        ScrobbleResult result = service.submitListen(fullTrack(), "lb-token", Instant.ofEpochSecond(1L));

        assertThat(result.success()).isFalse();
    }

    @Test
    @SuppressWarnings({"rawtypes", "unchecked"})
    void submitListen_sendsTokenAuthHeaderAndJsonContentType() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));

        service.submitListen(fullTrack(), "lb-token-xyz", Instant.ofEpochSecond(1_700_000_000L));

        ArgumentCaptor<HttpEntity> captor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(eq(API_URL), captor.capture(), eq(String.class));
        HttpEntity<?> entity = captor.getValue();

        assertThat(entity.getHeaders().getContentType()).isEqualTo(MediaType.APPLICATION_JSON);
        assertThat(entity.getHeaders().getFirst("Authorization")).isEqualTo("Token lb-token-xyz");
    }

    @Test
    @SuppressWarnings({"rawtypes", "unchecked"})
    void submitListen_buildsSingleListenPayload() throws Exception {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));

        Instant ts = Instant.ofEpochSecond(1_700_000_000L);
        service.submitListen(fullTrack(), "tok", ts);

        ArgumentCaptor<HttpEntity> captor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(eq(API_URL), captor.capture(), eq(String.class));
        String json = (String) captor.getValue().getBody();
        assertThat(json).isNotNull();

        Map<String, Object> body = new ObjectMapper().readValue(json, Map.class);
        assertThat(body.get("listen_type")).isEqualTo("single");

        List<Map<String, Object>> payload = (List<Map<String, Object>>) body.get("payload");
        assertThat(payload).hasSize(1);
        Map<String, Object> listen = payload.get(0);
        assertThat(((Number) listen.get("listened_at")).longValue()).isEqualTo(1_700_000_000L);

        Map<String, Object> metadata = (Map<String, Object>) listen.get("track_metadata");
        assertThat(metadata.get("artist_name")).isEqualTo("Radiohead");
        assertThat(metadata.get("track_name")).isEqualTo("Karma Police");
        assertThat(metadata.get("release_name")).isEqualTo("OK Computer");
    }

    @Test
    @SuppressWarnings({"rawtypes", "unchecked"})
    void submitListen_fallsBackToUnknownWhenArtistAndAlbumNull() throws Exception {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));

        Track orphan = Track.builder().title("Mystery").build();
        service.submitListen(orphan, "tok", Instant.ofEpochSecond(1L));

        ArgumentCaptor<HttpEntity> captor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(eq(API_URL), captor.capture(), eq(String.class));
        String json = (String) captor.getValue().getBody();
        Map<String, Object> body = new ObjectMapper().readValue(json, Map.class);
        List<Map<String, Object>> payload = (List<Map<String, Object>>) body.get("payload");
        Map<String, Object> metadata = (Map<String, Object>) payload.get(0).get("track_metadata");

        assertThat(metadata.get("artist_name")).isEqualTo("Unknown");
        assertThat(metadata.get("release_name")).isEqualTo("Unknown");
        assertThat(metadata.get("track_name")).isEqualTo("Mystery");
    }

    private Track fullTrack() {
        Artist a = new Artist();
        a.setName("Radiohead");
        Album alb = new Album();
        alb.setTitle("OK Computer");
        return Track.builder()
                .title("Karma Police")
                .artist(a)
                .album(alb)
                .duration(263)
                .build();
    }
}
