package com.musicode.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

class AudioStreamServiceTest {

    /**
     * Test parseRange directly — it's package-private so accessible from same package.
     * We instantiate with null TrackRepository since we only test parsing logic.
     */
    private final AudioStreamService service = new AudioStreamService(null);

    @Test
    void parseRange_explicitRange() {
        long[] range = service.parseRange("bytes=0-1023", 10000);
        assertNotNull(range);
        assertEquals(0, range[0]);
        assertEquals(1023, range[1]);
    }

    @Test
    void parseRange_openEnded() {
        long[] range = service.parseRange("bytes=5000-", 10000);
        assertNotNull(range);
        assertEquals(5000, range[0]);
        assertEquals(9999, range[1]);
    }

    @Test
    void parseRange_suffix() {
        long[] range = service.parseRange("bytes=-512", 10000);
        assertNotNull(range);
        assertEquals(9488, range[0]);
        assertEquals(9999, range[1]);
    }

    @Test
    void parseRange_endBeyondFileSize_clamps() {
        long[] range = service.parseRange("bytes=0-99999", 10000);
        assertNotNull(range);
        assertEquals(0, range[0]);
        assertEquals(9999, range[1]);
    }

    @Test
    void parseRange_invalidPrefix_returnsNull() {
        assertNull(service.parseRange("invalid=0-100", 10000));
    }

    @Test
    void parseRange_startGreaterThanEnd_returnsNull() {
        assertNull(service.parseRange("bytes=5000-100", 10000));
    }

    @Test
    void parseRange_multiRange_usesFirst() {
        long[] range = service.parseRange("bytes=0-100,200-300", 10000);
        assertNotNull(range);
        assertEquals(0, range[0]);
        assertEquals(100, range[1]);
    }

    @Test
    void parseRange_nonNumeric_returnsNull() {
        assertNull(service.parseRange("bytes=abc-def", 10000));
    }
}
