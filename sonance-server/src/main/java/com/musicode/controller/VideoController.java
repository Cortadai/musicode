package com.musicode.controller;

import com.musicode.exception.BadRequestException;
import com.musicode.exception.ConflictException;
import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.entity.VideoFolder;
import com.musicode.repository.VideoFolderRepository;
import com.musicode.service.VideoStreamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
@Tag(name = "Videos", description = "Video background folder management and streaming")
public class VideoController {

    private final VideoFolderRepository videoFolderRepository;
    private final VideoStreamService videoStreamService;

    @GetMapping
    @Operation(summary = "List available videos", description = "Returns filenames of all video files found in configured folders.")
    public List<String> listVideos() {
        return videoStreamService.listVideos();
    }

    @GetMapping("/stream/{filename}")
    @Operation(summary = "Stream a video file", description = "Streams a video with HTTP Range support for seeking.")
    public void streamVideo(@PathVariable String filename,
                            HttpServletRequest request,
                            HttpServletResponse response) throws IOException {
        videoStreamService.streamVideo(filename, request, response);
    }

    @GetMapping("/folders")
    @Operation(summary = "List video folders", description = "Returns all registered video folders.")
    public List<VideoFolder> getFolders() {
        return videoFolderRepository.findAll();
    }

    @PostMapping("/folders")
    @Operation(summary = "Add video folder", description = "Register a filesystem path as a video folder. ADMIN only.")
    public VideoFolder addFolder(@RequestBody Map<String, String> body) {
        var path = body.get("path");
        if (path == null || path.isBlank()) {
            throw new BadRequestException("Path is required");
        }
        if (!Files.isDirectory(Paths.get(path))) {
            throw new BadRequestException("Path does not exist or is not a directory: " + path);
        }
        if (videoFolderRepository.existsByPath(path)) {
            throw new ConflictException("Video folder already registered: " + path);
        }

        var folder = videoFolderRepository.save(VideoFolder.builder().path(path).build());
        log.info("Added video folder: {}", path);
        return folder;
    }

    @DeleteMapping("/folders/{id}")
    @Operation(summary = "Remove video folder", description = "Unregister a video folder. Does not delete files on disk. ADMIN only.")
    public Map<String, Object> removeFolder(@PathVariable Long id) {
        var folder = videoFolderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VideoFolder", id));

        videoFolderRepository.deleteById(id);
        log.info("Removed video folder id={} ({})", id, folder.getPath());
        return Map.of("deleted", id);
    }
}
