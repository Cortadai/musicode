package com.musicode.controller;

import com.musicode.model.dto.ScanStatus;
import com.musicode.model.entity.LibraryFolder;
import com.musicode.repository.LibraryFolderRepository;
import com.musicode.service.LibraryScanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
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
    public ResponseEntity<?> addFolder(@RequestBody Map<String, String> body) {
        String path = body.get("path");
        if (path == null || path.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Path is required"));
        }

        // Validate the path exists
        Path folderPath = Paths.get(path);
        if (!Files.isDirectory(folderPath)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Path does not exist or is not a directory: " + path));
        }

        // Check for duplicates
        if (libraryFolderRepository.existsByPath(path)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Folder already registered: " + path));
        }

        LibraryFolder folder = LibraryFolder.builder()
                .path(path)
                .build();
        folder = libraryFolderRepository.save(folder);

        log.info("Added library folder: {}", path);
        return ResponseEntity.ok(folder);
    }

    @DeleteMapping("/folders/{id}")
    public ResponseEntity<?> removeFolder(@PathVariable Long id) {
        if (!libraryFolderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        libraryFolderRepository.deleteById(id);
        log.info("Removed library folder with id: {}", id);
        return ResponseEntity.ok(Map.of("deleted", id));
    }

    @PostMapping("/scan")
    public ResponseEntity<?> startScan() {
        if (libraryScanService.isScanning()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Scan already in progress"));
        }

        if (libraryFolderRepository.count() == 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "No library folders configured. Add a folder first."));
        }

        libraryScanService.scanAllFolders();
        return ResponseEntity.ok(Map.of("message", "Scan started"));
    }

    @GetMapping("/scan/status")
    public ScanStatus getScanStatus() {
        return libraryScanService.getStatus();
    }
}
