package com.musicode.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicode.model.entity.Track;
import com.musicode.repository.TrackRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Slf4j
@Service
public class WaveformService {

    private static final int TARGET_BARS = 200;
    private static final int DOWNSAMPLE_RATE = 8000;

    private final TrackRepository trackRepository;
    private final ObjectMapper objectMapper;
    private final Path waveformsDir;
    private final String ffmpegPath;

    public WaveformService(
            TrackRepository trackRepository,
            ObjectMapper objectMapper,
            @Value("${musicode.waveforms-dir:./data/waveforms}") String waveformsDir,
            @Value("${musicode.ffmpeg-path:ffmpeg}") String ffmpegPath) {
        this.trackRepository = trackRepository;
        this.objectMapper = objectMapper;
        this.ffmpegPath = ffmpegPath;
        this.waveformsDir = Paths.get(waveformsDir);
        try {
            Files.createDirectories(this.waveformsDir);
        } catch (IOException e) {
            log.error("Failed to create waveforms directory: {}", waveformsDir, e);
        }
    }

    private Optional<float[]> readCachedWaveform(Path cacheFile) {
        try {
            float[] peaks = objectMapper.readValue(cacheFile.toFile(), float[].class);
            return Optional.of(peaks);
        } catch (IOException e) {
            log.warn("Failed to read cached waveform {}: {}", cacheFile, e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<float[]> getWaveform(Long trackId) {
        Path cacheFile = waveformsDir.resolve(trackId + ".json");

        if (Files.exists(cacheFile)) {
            return readCachedWaveform(cacheFile);
        }

        Optional<Track> trackOpt = trackRepository.findById(trackId);
        if (trackOpt.isEmpty()) {
            return Optional.empty();
        }

        Track track = trackOpt.get();
        Path audioFile = Path.of(track.getFilePath());
        if (!Files.exists(audioFile) || !Files.isReadable(audioFile)) {
            log.warn("Audio file not found or not readable for track {}: {}", trackId, audioFile);
            return Optional.empty();
        }

        return generateAndCache(trackId, audioFile, cacheFile);
    }

    private Optional<float[]> generateAndCache(Long trackId, Path audioFile, Path cacheFile) {
        try {
            float[] peaks = extractPeaks(audioFile);
            if (peaks == null || peaks.length == 0) {
                log.warn("No peaks extracted for track {}", trackId);
                return Optional.empty();
            }

            objectMapper.writeValue(cacheFile.toFile(), peaks);
            log.debug("Generated waveform for track {}: {} bars", trackId, peaks.length);
            return Optional.of(peaks);

        } catch (IOException | InterruptedException e) {
            log.error("Failed to generate waveform for track {}: {}", trackId, e.getMessage());
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return Optional.empty();
        }
    }

    float[] extractPeaks(Path audioFile) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(
                ffmpegPath,
                "-i", audioFile.toString(),
                "-ac", "1",
                "-filter:a", "aresample=" + DOWNSAMPLE_RATE,
                "-f", "f32le",
                "-v", "error",
                "-"
        );
        pb.redirectErrorStream(true);

        Process process = pb.start();

        byte[] rawBytes;
        try (InputStream is = process.getInputStream()) {
            rawBytes = is.readAllBytes();
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            log.warn("ffmpeg exited with code {} for {}", exitCode, audioFile);
            return null;
        }

        if (rawBytes.length < 4) {
            return null;
        }

        int sampleCount = rawBytes.length / 4;
        ByteBuffer buffer = ByteBuffer.wrap(rawBytes).order(ByteOrder.LITTLE_ENDIAN);

        float[] samples = new float[sampleCount];
        for (int i = 0; i < sampleCount; i++) {
            samples[i] = Math.abs(buffer.getFloat());
        }

        return downsample(samples, TARGET_BARS);
    }

    float[] downsample(float[] samples, int targetBars) {
        if (samples.length <= targetBars) {
            return normalize(samples);
        }

        float[] peaks = new float[targetBars];
        float samplesPerBar = (float) samples.length / targetBars;

        for (int bar = 0; bar < targetBars; bar++) {
            int start = Math.round(bar * samplesPerBar);
            int end = Math.round((bar + 1) * samplesPerBar);
            end = Math.min(end, samples.length);

            float max = 0;
            for (int i = start; i < end; i++) {
                if (samples[i] > max) {
                    max = samples[i];
                }
            }
            peaks[bar] = max;
        }

        return normalize(peaks);
    }

    private float[] normalize(float[] peaks) {
        float max = 0;
        for (float peak : peaks) {
            if (peak > max) {
                max = peak;
            }
        }

        if (max == 0) {
            return peaks;
        }

        float[] normalized = new float[peaks.length];
        for (int i = 0; i < peaks.length; i++) {
            normalized[i] = Math.round(peaks[i] / max * 1000f) / 1000f;
        }
        return normalized;
    }
}
