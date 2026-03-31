package com.musicode.controller;

import com.musicode.exception.BadRequestException;
import com.musicode.exception.ConflictException;
import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.dto.ScanStatus;
import com.musicode.model.entity.LibraryFolder;
import com.musicode.repository.LibraryFolderRepository;
import com.musicode.service.LibraryScanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
@Tag(name = "Library", description = "Library folder management and scanning (ADMIN only for mutations)")
public class LibraryController {

    private final LibraryFolderRepository libraryFolderRepository;
    private final LibraryScanService libraryScanService;

    @GetMapping("/folders")
    @Operation(summary = "List library folders", description = "Returns all registered music folders.")
    public List<LibraryFolder> getFolders() {
        return libraryFolderRepository.findAll();
    }

    @PostMapping("/folders")
    @Operation(summary = "Add library folder", description = "Register a filesystem path as a music folder. Path must exist and be a directory. ADMIN only.")
    public LibraryFolder addFolder(@RequestBody Map<String, String> body) {
        var path = body.get("path");
        if (path == null || path.isBlank()) {
            throw new BadRequestException("Path is required");
        }
        if (!Files.isDirectory(Paths.get(path))) {
            throw new BadRequestException("Path does not exist or is not a directory: " + path);
        }
        if (libraryFolderRepository.existsByPath(path)) {
            throw new ConflictException("Folder already registered: " + path);
        }

        var folder = libraryFolderRepository.save(LibraryFolder.builder().path(path).build());
        log.info("Added library folder: {}", path);
        return folder;
    }

    @DeleteMapping("/folders/{id}")
    @Operation(summary = "Remove library folder", description = "Unregister a music folder. Does not delete files. ADMIN only.")
    public Map<String, Long> removeFolder(@PathVariable Long id) {
        if (!libraryFolderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Folder", id);
        }
        libraryFolderRepository.deleteById(id);
        log.info("Removed library folder with id: {}", id);
        return Map.of("deleted", id);
    }

    @PostMapping("/scan")
    @Operation(summary = "Start library scan", description = "Scan all registered folders for audio files. Runs asynchronously. ADMIN only.")
    public Map<String, String> startScan() {
        if (libraryScanService.isScanning()) {
            throw new BadRequestException("Scan already in progress");
        }
        if (libraryFolderRepository.count() == 0) {
            throw new BadRequestException("No library folders configured. Add a folder first.");
        }

        libraryScanService.scanAllFolders();
        return Map.of("message", "Scan started");
    }

    @GetMapping("/scan/status")
    @Operation(summary = "Get scan status", description = "Returns current scan progress (phase, files processed, total).")
    public ScanStatus getScanStatus() {
        return libraryScanService.getStatus();
    }

    @PostMapping("/cleanup")
    @Operation(summary = "Clean up orphan tracks", description = "Remove tracks whose audio files no longer exist on disk. ADMIN only.")
    public Map<String, Integer> cleanupOrphans() {
        var removed = libraryScanService.removeOrphanTracks();
        log.info("Cleanup complete: {} orphan tracks removed", removed);
        return Map.of("removed", removed);
    }
}
