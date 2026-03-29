package com.musicode.model.dto;

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

    public int getProgressPercent() {
        if (totalFiles == 0) return 0;
        return (int) ((processedFiles * 100L) / totalFiles);
    }
}
