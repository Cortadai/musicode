package com.musicode.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScanStatus {

    public enum State {
        IDLE, SCANNING, COMPLETED, FAILED
    }

    private State state = State.IDLE;
    private int totalFiles;
    private int processedFiles;
    private int errorFiles;
    private int newTracks;
    private int updatedTracks;
    private String currentFile;
    private String errorMessage;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    // --- JSON serialization aligned with frontend ScanStatus interface ---

    @JsonProperty("scanning")
    public boolean isScanning() {
        return state == State.SCANNING;
    }

    @JsonProperty("filesFound")
    public int getFilesFound() {
        return totalFiles;
    }

    @JsonProperty("errors")
    public int getErrors() {
        return errorFiles;
    }

    @JsonProperty("filesSkipped")
    public int getFilesSkipped() {
        return 0;
    }

    public int getProgressPercent() {
        if (totalFiles == 0) return 0;
        return (int) ((processedFiles * 100L) / totalFiles);
    }
}
