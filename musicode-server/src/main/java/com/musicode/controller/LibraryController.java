package com.musicode.controller;

import com.musicode.exception.BadRequestException;
import com.musicode.exception.ConflictException;
import com.musicode.exception.ResourceNotFoundException;
import com.musicode.model.dto.ScanStatus;
import com.musicode.model.entity.LibraryFolder;
import com.musicode.repository.LibraryFolderRepository;
import com.musicode.service.LibraryScanService;
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
public class LibraryController {

    private final LibraryFolderRepository libraryFolderRepository;
    private final LibraryScanService libraryScanService;

    @GetMapping("/folders")
    public List<LibraryFolder> getFolders() {
        return libraryFolderRepository.findAll();
    }

    @PostMapping("/folders")
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
    public Map<String, Long> removeFolder(@PathVariable Long id) {
        if (!libraryFolderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Folder", id);
        }
        libraryFolderRepository.deleteById(id);
        log.info("Removed library folder with id: {}", id);
        return Map.of("deleted", id);
    }

    @PostMapping("/scan")
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
    public ScanStatus getScanStatus() {
        return libraryScanService.getStatus();
    }

    @PostMapping("/cleanup")
    public Map<String, Integer> cleanupOrphans() {
        var removed = libraryScanService.removeOrphanTracks();
        log.info("Cleanup complete: {} orphan tracks removed", removed);
        return Map.of("removed", removed);
    }
}
