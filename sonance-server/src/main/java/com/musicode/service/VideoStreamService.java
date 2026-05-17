package com.musicode.service;

import com.musicode.repository.VideoFolderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoStreamService {

    private static final int BUFFER_SIZE = 65536; // 64KB for video
    private static final Set<String> VIDEO_EXTENSIONS = Set.of(".mp4", ".webm", ".mkv", ".mov");

    private final VideoFolderRepository videoFolderRepository;

    public List<String> listVideos() {
        List<String> videos = new ArrayList<>();
        videoFolderRepository.findAll().forEach(folder -> {
            Path dir = Path.of(folder.getPath());
            if (Files.isDirectory(dir)) {
                try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir, this::isVideoFile)) {
                    for (Path entry : stream) {
                        videos.add(entry.getFileName().toString());
                    }
                } catch (IOException e) {
                    log.warn("Failed to list videos in {}: {}", dir, e.getMessage());
                }
            }
        });
        return videos;
    }

    public boolean streamVideo(String filename, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Path videoPath = resolveVideoPath(filename);
        if (videoPath == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Video not found: " + filename);
            return false;
        }

        long fileSize = Files.size(videoPath);
        String contentType = resolveContentType(videoPath);
        String rangeHeader = request.getHeader("Range");

        if (rangeHeader == null) {
            sendFullContent(response, videoPath, fileSize, contentType);
        } else {
            sendPartialContent(response, videoPath, fileSize, contentType, rangeHeader);
        }
        return true;
    }

    private Path resolveVideoPath(String filename) {
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            return null;
        }
        for (var folder : videoFolderRepository.findAll()) {
            Path candidate = Path.of(folder.getPath(), filename);
            if (Files.exists(candidate) && Files.isReadable(candidate) && isVideoFile(candidate)) {
                return candidate;
            }
        }
        return null;
    }

    private boolean isVideoFile(Path path) {
        String name = path.getFileName().toString().toLowerCase();
        return VIDEO_EXTENSIONS.stream().anyMatch(name::endsWith);
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

    long[] parseRange(String rangeHeader, long fileSize) {
        if (!rangeHeader.startsWith("bytes=")) {
            return null;
        }

        String rangeSpec = rangeHeader.substring(6).trim();
        if (rangeSpec.contains(",")) {
            rangeSpec = rangeSpec.split(",")[0].trim();
        }

        try {
            long start;
            long end;

            if (rangeSpec.startsWith("-")) {
                long suffix = Long.parseLong(rangeSpec.substring(1));
                start = fileSize - suffix;
                end = fileSize - 1;
            } else if (rangeSpec.endsWith("-")) {
                start = Long.parseLong(rangeSpec.substring(0, rangeSpec.length() - 1));
                end = fileSize - 1;
            } else {
                String[] parts = rangeSpec.split("-");
                start = Long.parseLong(parts[0]);
                end = Long.parseLong(parts[1]);
            }

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
        if (name.endsWith(".mp4")) return "video/mp4";
        if (name.endsWith(".webm")) return "video/webm";
        if (name.endsWith(".mkv")) return "video/x-matroska";
        if (name.endsWith(".mov")) return "video/quicktime";
        return "application/octet-stream";
    }
}
