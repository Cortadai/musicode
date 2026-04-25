package com.musicode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicode.model.entity.Track;
import com.musicode.repository.TrackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WaveformServiceTest {

    @Mock
    private TrackRepository trackRepository;

    private WaveformService waveformService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        waveformService = new WaveformService(
                trackRepository,
                new ObjectMapper(),
                tempDir.toString(),
                "ffmpeg"
        );
    }

    @Test
    void getWaveform_trackNotFound_returnsEmpty() {
        when(trackRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<float[]> result = waveformService.getWaveform(999L);

        assertThat(result).isEmpty();
    }

    @Test
    void getWaveform_audioFileNotFound_returnsEmpty() {
        Track track = Track.builder()
                .id(1L)
                .filePath("/nonexistent/audio.flac")
                .build();
        when(trackRepository.findById(1L)).thenReturn(Optional.of(track));

        Optional<float[]> result = waveformService.getWaveform(1L);

        assertThat(result).isEmpty();
    }

    @Test
    void getWaveform_cachedFile_returnsCached() throws IOException {
        float[] peaks = new float[]{0.1f, 0.5f, 1.0f, 0.3f};
        Path cacheFile = tempDir.resolve("42.json");
        new ObjectMapper().writeValue(cacheFile.toFile(), peaks);

        Optional<float[]> result = waveformService.getWaveform(42L);

        assertThat(result).isPresent();
        assertThat(result.get()).hasSize(4);
        assertThat(result.get()[2]).isEqualTo(1.0f);
    }

    @Test
    void downsample_shorterThanTarget_normalizes() {
        float[] samples = {0.2f, 0.4f, 0.8f};

        float[] result = waveformService.downsample(samples, 200);

        assertThat(result).hasSize(3);
        assertThat(result[2]).isEqualTo(1.0f);
        assertThat(result[0]).isEqualTo(0.25f);
    }

    @Test
    void downsample_longerThanTarget_reducesToTarget() {
        float[] samples = new float[1000];
        for (int i = 0; i < samples.length; i++) {
            samples[i] = (float) Math.sin(i * 0.1) * 0.5f + 0.5f;
        }

        float[] result = waveformService.downsample(samples, 200);

        assertThat(result).hasSize(200);
        for (float v : result) {
            assertThat(v).isBetween(0f, 1.0f);
        }
    }

    @Test
    void downsample_allZeros_returnsZeros() {
        float[] samples = new float[500];

        float[] result = waveformService.downsample(samples, 200);

        assertThat(result).hasSize(200);
        for (float v : result) {
            assertThat(v).isEqualTo(0f);
        }
    }

    @Test
    void downsample_singlePeak_normalizedCorrectly() {
        float[] samples = new float[400];
        samples[200] = 0.5f;

        float[] result = waveformService.downsample(samples, 200);

        assertThat(result).hasSize(200);
        float max = 0;
        for (float v : result) {
            if (v > max) max = v;
        }
        assertThat(max).isEqualTo(1.0f);
    }
}
