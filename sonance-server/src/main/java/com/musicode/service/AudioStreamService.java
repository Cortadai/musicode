package com.musicode.service;

import com.musicode.model.entity.Track;
import com.musicode.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AudioStreamService {

    private static final int BUFFER_SIZE = 8192;

    private final TrackRepository trackRepository;

    /**
     * Stream a track with HTTP Range support (206 Partial Content).
     * Returns false if track not found or file missing.
     */
    public boolean streamTrack(Long trackId, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Optional<Track> optTrack = trackRepository.findById(trackId);
        if (optTrack.isEmpty()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Track not found: " + trackId);
            return false;
        }

        Track track = optTrack.get();
        Path filePath = Path.of(track.getFilePath());

        if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
            log.warn("Audio file not accessible: {}", filePath);
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Audio file not found on disk");
            return false;
        }

        long fileSize = Files.size(filePath);
        String contentType = resolveContentType(filePath);
        String rangeHeader = request.getHeader("Range");

        if (rangeHeader == null) {
            // Full content — 200 OK
            sendFullContent(response, filePath, fileSize, contentType);
        } else {
            // Partial content — 206
            sendPartialContent(response, filePath, fileSize, contentType, rangeHeader);
        }

        return true;
    }

    private void sendFullContent(HttpServletResponse response, Path filePath, long fileSize, String contentType) throws IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType(contentType);
        response.setContentLengthLong(fileSize);
        response.setHeader("Accept-Ranges", "bytes");

        try (RandomAccessFile raf = new RandomAccessFile(filePath.toFile(), "r");
             OutputStream out = response.getOutputStream()) {
            transferBytes(raf, out, 0, fileSize - 1);
        }
    }

    private void sendPartialContent(HttpServletResponse response, Path filePath, long fileSize, String contentType, String rangeHeader) throws IOException {
        long[] range = parseRange(rangeHeader, fileSize);
        if (range == null) {
            response.setStatus(HttpServletResponse.SC_REQUESTED_RANGE_NOT_SATISFIABLE);
            response.setHeader("Content-Range", "bytes */" + fileSize);
            return;
        }

        long start = range[0];
        long end = range[1];
        long contentLength = end - start + 1;

        response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
        response.setContentType(contentType);
        response.setContentLengthLong(contentLength);
        response.setHeader("Accept-Ranges", "bytes");
        response.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + fileSize);

        try (RandomAccessFile raf = new RandomAccessFile(filePath.toFile(), "r");
             OutputStream out = response.getOutputStream()) {
            transferBytes(raf, out, start, end);
        }
    }

    /**
     * Parse "Range: bytes=start-end" header.
     * Supports: bytes=0-1023, bytes=1024-, bytes=-512
     * Returns [start, end] or null if invalid.
     */
    long[] parseRange(String rangeHeader, long fileSize) {
        if (!rangeHeader.startsWith("bytes=")) {
            return null;
        }

        String rangeSpec = rangeHeader.substring(6).trim();
        // Only handle single range (multi-range not needed for audio playback)
        if (rangeSpec.contains(",")) {
            rangeSpec = rangeSpec.split(",")[0].trim();
        }

        try {
            long start;
            long end;

            if (rangeSpec.startsWith("-")) {
                // Suffix range: last N bytes
                long suffix = Long.parseLong(rangeSpec.substring(1));
                start = fileSize - suffix;
                end = fileSize - 1;
            } else if (rangeSpec.endsWith("-")) {
                // Open-ended: from start to EOF
                start = Long.parseLong(rangeSpec.substring(0, rangeSpec.length() - 1));
                end = fileSize - 1;
            } else {
                String[] parts = rangeSpec.split("-");
                start = Long.parseLong(parts[0]);
                end = Long.parseLong(parts[1]);
            }

            // Clamp and validate
            if (start < 0) start = 0;
            if (end >= fileSize) end = fileSize - 1;
            if (start > end) return null;

            return new long[]{start, end};
        } catch (NumberFormatException e) {
            log.warn("Invalid Range header: {}", rangeHeader);
            return null;
        }
    }

    private void transferBytes(RandomAccessFile raf, OutputStream out, long start, long end) throws IOException {
        raf.seek(start);
        long remaining = end - start + 1;
        byte[] buffer = new byte[BUFFER_SIZE];

        while (remaining > 0) {
            int toRead = (int) Math.min(buffer.length, remaining);
            int bytesRead = raf.read(buffer, 0, toRead);
            if (bytesRead == -1) break;
            out.write(buffer, 0, bytesRead);
            remaining -= bytesRead;
        }
        out.flush();
    }

    private String resolveContentType(Path filePath) {
        String name = filePath.getFileName().toString().toLowerCase();
        if (name.endsWith(".flac")) return "audio/flac";
        if (name.endsWith(".mp3")) return "audio/mpeg";
        if (name.endsWith(".ogg")) return "audio/ogg";
        if (name.endsWith(".m4a")) return "audio/mp4";
        if (name.endsWith(".wav")) return "audio/wav";
        return "application/octet-stream";
    }
}
