package com.musicode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicode.repository.TrackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@EnabledIf("isFfmpegAvailable")
class WaveformServiceIntegrationTest {

    @Mock
    private TrackRepository trackRepository;

    private WaveformService waveformService;

    @TempDir
    Path tempDir;

    static boolean isFfmpegAvailable() {
        try {
            Process p = new ProcessBuilder("ffmpeg", "-version").start();
            p.waitFor();
            return p.exitValue() == 0;
        } catch (Exception e) {
            return false;
        }
    }

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
    void extractPeaks_fromSyntheticWav_returnsNormalizedPeaks() throws Exception {
        Path wavFile = generateSineWav(tempDir.resolve("test.wav"), 440, 3);

        float[] peaks = waveformService.extractPeaks(wavFile);

        assertThat(peaks).isNotNull();
        assertThat(peaks).hasSize(200);
        for (float peak : peaks) {
            assertThat(peak).isBetween(0f, 1.0f);
        }
        float max = 0;
        for (float p : peaks) if (p > max) max = p;
        assertThat(max).isEqualTo(1.0f);
    }

    @Test
    void extractPeaks_fromSilentWav_returnsZeroPeaks() throws Exception {
        Path wavFile = generateSilentWav(tempDir.resolve("silent.wav"), 2);

        float[] peaks = waveformService.extractPeaks(wavFile);

        assertThat(peaks).isNotNull();
        for (float peak : peaks) {
            assertThat(peak).isEqualTo(0f);
        }
    }

    private Path generateSineWav(Path output, int freqHz, int durationSec) throws IOException {
        int sampleRate = 44100;
        int numSamples = sampleRate * durationSec;
        short[] samples = new short[numSamples];
        for (int i = 0; i < numSamples; i++) {
            samples[i] = (short) (Short.MAX_VALUE * Math.sin(2 * Math.PI * freqHz * i / sampleRate));
        }
        return writeWav(output, samples, sampleRate);
    }

    private Path generateSilentWav(Path output, int durationSec) throws IOException {
        int sampleRate = 44100;
        int numSamples = sampleRate * durationSec;
        return writeWav(output, new short[numSamples], sampleRate);
    }

    private Path writeWav(Path output, short[] samples, int sampleRate) throws IOException {
        int dataSize = samples.length * 2;
        ByteBuffer buf = ByteBuffer.allocate(44 + dataSize).order(ByteOrder.LITTLE_ENDIAN);

        buf.put("RIFF".getBytes());
        buf.putInt(36 + dataSize);
        buf.put("WAVE".getBytes());
        buf.put("fmt ".getBytes());
        buf.putInt(16);
        buf.putShort((short) 1);
        buf.putShort((short) 1);
        buf.putInt(sampleRate);
        buf.putInt(sampleRate * 2);
        buf.putShort((short) 2);
        buf.putShort((short) 16);
        buf.put("data".getBytes());
        buf.putInt(dataSize);
        for (short s : samples) {
            buf.putShort(s);
        }

        Files.write(output, buf.array());
        return output;
    }
}
