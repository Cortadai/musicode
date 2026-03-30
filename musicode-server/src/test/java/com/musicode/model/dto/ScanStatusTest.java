package com.musicode.model.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ScanStatusTest {

    @Test
    void initialState_isIdle() {
        ScanStatus status = new ScanStatus();
        assertEquals(ScanStatus.State.IDLE, status.getState());
        assertFalse(status.isScanning());
    }

    @Test
    void isScanning_returnsTrueWhenScanning() {
        ScanStatus status = new ScanStatus();
        status.setState(ScanStatus.State.SCANNING);
        assertTrue(status.isScanning());
    }

    @Test
    void isScanning_returnsFalseWhenCompleted() {
        ScanStatus status = new ScanStatus();
        status.setState(ScanStatus.State.COMPLETED);
        assertFalse(status.isScanning());
    }

    @Test
    void filesFound_mapsTotalFiles() {
        ScanStatus status = new ScanStatus();
        status.setTotalFiles(42);
        assertEquals(42, status.getFilesFound());
    }

    @Test
    void errors_mapsErrorFiles() {
        ScanStatus status = new ScanStatus();
        status.setErrorFiles(3);
        assertEquals(3, status.getErrors());
    }

    @Test
    void filesSkipped_alwaysZero() {
        ScanStatus status = new ScanStatus();
        assertEquals(0, status.getFilesSkipped());
    }

    @Test
    void progressPercent_calculatesCorrectly() {
        ScanStatus status = new ScanStatus();
        status.setTotalFiles(100);
        status.setProcessedFiles(75);
        assertEquals(75, status.getProgressPercent());
    }

    @Test
    void progressPercent_zeroTotalFiles_returnsZero() {
        ScanStatus status = new ScanStatus();
        status.setTotalFiles(0);
        assertEquals(0, status.getProgressPercent());
    }
}
