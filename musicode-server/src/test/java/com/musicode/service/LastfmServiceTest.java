package com.musicode.service;

import com.musicode.config.LastfmConfig;
import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.Track;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Map;
import java.util.TreeMap;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class LastfmServiceTest {

    private static final String API_URL = "https://ws.audioscrobbler.com/2.0/";
    private static final String API_KEY = "test-api-key";
    private static final String API_SECRET = "test-api-secret";

    private LastfmConfig config;
    private RestTemplate restTemplate;
    private LastfmService service;

    @BeforeEach
    void setUp() {
        config = new LastfmConfig();
        config.setApiKey(API_KEY);
        config.setApiSecret(API_SECRET);
        restTemplate = mock(RestTemplate.class);
        service = new LastfmService(config);
        ReflectionTestUtils.setField(service, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(service, "apiUrl", API_URL);
    }

    @Test
    void isConfigured_trueWhenKeyAndSecretPresent() {
        assertThat(service.isConfigured()).isTrue();
    }

    @Test
    void isConfigured_falseWhenKeyBlank() {
        config.setApiKey("");
        assertThat(service.isConfigured()).isFalse();
    }

    @Test
    void isConfigured_falseWhenSecretBlank() {
        config.setApiSecret("");
        assertThat(service.isConfigured()).isFalse();
    }

    @Test
    void generateSignature_deterministicMd5OfSortedParamsPlusSecret() throws Exception {
        var params = new TreeMap<String, String>();
        params.put("method", "auth.getMobileSession");
        params.put("username", "alice");
        params.put("password", "hunter2");
        params.put("api_key", API_KEY);

        String actual = invokeSignature(params);

        String expected = md5Hex(
                "api_key" + API_KEY
                        + "method" + "auth.getMobileSession"
                        + "password" + "hunter2"
                        + "username" + "alice"
                        + API_SECRET);
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void authenticate_returnsNullWhenConfigBlank() {
        config.setApiKey("");
        assertThat(service.authenticate("alice", "hunter2")).isNull();
    }

    @Test
    void authenticate_returnsSessionKeyOnSuccess() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of(
                        "session", Map.of("name", "alice", "key", "sess-abc-123"))));

        String key = service.authenticate("alice", "hunter2");

        assertThat(key).isEqualTo("sess-abc-123");
    }

    @Test
    void authenticate_returnsNullWhenBodyHasNoSession() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of("error", 4, "message", "Authentication failed")));

        String key = service.authenticate("alice", "bad-password");

        assertThat(key).isNull();
    }

    @Test
    void authenticate_returnsNullOnException() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(new RestClientException("boom"));

        String key = service.authenticate("alice", "hunter2");

        assertThat(key).isNull();
    }

    @Test
    @SuppressWarnings("unchecked")
    void authenticate_postsFormEncodedWithSignature() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of(
                        "session", Map.of("key", "sess-xyz"))));

        service.authenticate("alice", "hunter2");

        @SuppressWarnings("rawtypes")
        var captor = org.mockito.ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(eq(API_URL), captor.capture(), eq(Map.class));
        HttpEntity<?> entity = captor.getValue();

        assertThat(entity.getHeaders().getContentType()).isEqualTo(MediaType.APPLICATION_FORM_URLENCODED);
        var body = (MultiValueMap<String, String>) entity.getBody();
        assertThat(body).isNotNull();
        assertThat(body.getFirst("method")).isEqualTo("auth.getMobileSession");
        assertThat(body.getFirst("username")).isEqualTo("alice");
        assertThat(body.getFirst("password")).isEqualTo("hunter2");
        assertThat(body.getFirst("api_key")).isEqualTo(API_KEY);
        assertThat(body.getFirst("format")).isEqualTo("json");
        assertThat(body.getFirst("api_sig")).isNotBlank();
    }

    @Test
    void scrobble_returnsFalseWhenConfigBlank() {
        config.setApiSecret("");
        boolean ok = service.scrobble(fullTrack(), "sk", Instant.ofEpochSecond(1_700_000_000L));
        assertThat(ok).isFalse();
    }

    @Test
    void scrobble_returnsTrueOn2xx() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of("scrobbles", Map.of("@attr", Map.of("accepted", 1)))));

        boolean ok = service.scrobble(fullTrack(), "sk", Instant.ofEpochSecond(1_700_000_000L));

        assertThat(ok).isTrue();
    }

    @Test
    void scrobble_returnsFalseOnNon2xx() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", 9)));

        boolean ok = service.scrobble(fullTrack(), "sk", Instant.ofEpochSecond(1_700_000_000L));

        assertThat(ok).isFalse();
    }

    @Test
    void scrobble_returnsFalseOnException() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(new RestClientException("network down"));

        boolean ok = service.scrobble(fullTrack(), "sk", Instant.ofEpochSecond(1_700_000_000L));

        assertThat(ok).isFalse();
    }

    @Test
    @SuppressWarnings("unchecked")
    void scrobble_buildsPayloadWithOptionalFields() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of("scrobbles", Map.of())));

        Instant ts = Instant.ofEpochSecond(1_700_000_000L);
        service.scrobble(fullTrack(), "sk-42", ts);

        @SuppressWarnings("rawtypes")
        var captor = org.mockito.ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(eq(API_URL), captor.capture(), eq(Map.class));
        var body = (MultiValueMap<String, String>) captor.getValue().getBody();

        assertThat(body).isNotNull();
        assertThat(body.getFirst("method")).isEqualTo("track.scrobble");
        assertThat(body.getFirst("artist")).isEqualTo("Radiohead");
        assertThat(body.getFirst("track")).isEqualTo("Karma Police");
        assertThat(body.getFirst("album")).isEqualTo("OK Computer");
        assertThat(body.getFirst("duration")).isEqualTo("263");
        assertThat(body.getFirst("timestamp")).isEqualTo("1700000000");
        assertThat(body.getFirst("sk")).isEqualTo("sk-42");
        assertThat(body.getFirst("api_key")).isEqualTo(API_KEY);
        assertThat(body.getFirst("api_sig")).isNotBlank();
    }

    @Test
    @SuppressWarnings("unchecked")
    void scrobble_omitsAlbumAndDurationWhenNull() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of("scrobbles", Map.of())));

        Track t = Track.builder()
                .title("Untitled")
                .artist(artist("Unknown Artist"))
                .build();

        service.scrobble(t, "sk", Instant.ofEpochSecond(1L));

        @SuppressWarnings("rawtypes")
        var captor = org.mockito.ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(eq(API_URL), captor.capture(), eq(Map.class));
        var body = (MultiValueMap<String, String>) captor.getValue().getBody();

        assertThat(body.getFirst("album")).isNull();
        assertThat(body.getFirst("duration")).isNull();
        assertThat(body.getFirst("artist")).isEqualTo("Unknown Artist");
    }

    @Test
    @SuppressWarnings("unchecked")
    void scrobble_usesUnknownWhenArtistNull() {
        when(restTemplate.postForEntity(eq(API_URL), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(Map.of("scrobbles", Map.of())));

        Track t = Track.builder().title("Orphan").build();

        service.scrobble(t, "sk", Instant.ofEpochSecond(1L));

        @SuppressWarnings("rawtypes")
        var captor = org.mockito.ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(eq(API_URL), captor.capture(), eq(Map.class));
        var body = (MultiValueMap<String, String>) captor.getValue().getBody();
        assertThat(body.getFirst("artist")).isEqualTo("Unknown");
    }

    private Track fullTrack() {
        return Track.builder()
                .title("Karma Police")
                .artist(artist("Radiohead"))
                .album(album("OK Computer"))
                .duration(263)
                .build();
    }

    private Artist artist(String name) {
        Artist a = new Artist();
        a.setName(name);
        return a;
    }

    private Album album(String title) {
        Album a = new Album();
        a.setTitle(title);
        return a;
    }

    private String invokeSignature(Map<String, String> params) throws Exception {
        Method m = LastfmService.class.getDeclaredMethod("generateSignature", Map.class);
        m.setAccessible(true);
        return (String) m.invoke(service, params);
    }

    private static String md5Hex(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] d = md.digest(input.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : d) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}
