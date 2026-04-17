package com.musicode.service;

import com.musicode.model.dto.ScanStatus;
import com.musicode.model.dto.TrackMetadata;
import com.musicode.model.entity.Album;
import com.musicode.model.entity.Artist;
import com.musicode.model.entity.LibraryFolder;
import com.musicode.model.entity.Track;
import com.musicode.repository.AlbumRepository;
import com.musicode.repository.ArtistRepository;
import com.musicode.repository.LibraryFolderRepository;
import com.musicode.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class LibraryScanService {

    private final MetadataService metadataService;
    private final CoverArtService coverArtService;
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;
    private final TrackRepository trackRepository;
    private final LibraryFolderRepository libraryFolderRepository;

    private final ScanStatus scanStatus = new ScanStatus();

    public ScanStatus getStatus() {
        return scanStatus;
    }

    public boolean isScanning() {
        return scanStatus.getState() == ScanStatus.State.SCANNING;
    }

    /**
     * Scan all registered library folders asynchronously.
     */
    @Async
    public void scanAllFolders() {
        if (isScanning()) {
            log.warn("Scan already in progress, ignoring request");
            return;
        }

        List<LibraryFolder> folders = libraryFolderRepository.findAll();
        if (folders.isEmpty()) {
            log.warn("No library folders configured — nothing to scan");
            return;
        }

        resetStatus();
        scanStatus.setState(ScanStatus.State.SCANNING);
        scanStatus.setStartedAt(LocalDateTime.now());
        log.info("Starting library scan of {} folder(s)", folders.size());

        try {
            // Count total audio files across all folders
            int totalFiles = 0;
            for (LibraryFolder folder : folders) {
                totalFiles += countAudioFiles(Paths.get(folder.getPath()));
            }
            scanStatus.setTotalFiles(totalFiles);
            log.info("Found {} audio files to process", totalFiles);

            // Process each folder
            for (LibraryFolder folder : folders) {
                scanFolder(folder);
            }

            scanStatus.setState(ScanStatus.State.COMPLETED);
            scanStatus.setCompletedAt(LocalDateTime.now());

            // Clean up any albums/artists that became orphans due to regrouping
            cleanupOrphanAlbumsAndArtists();

            log.info("Library scan completed: {} processed, {} new, {} updated, {} errors",
                    scanStatus.getProcessedFiles(),
                    scanStatus.getNewTracks(),
                    scanStatus.getUpdatedTracks(),
                    scanStatus.getErrorFiles());

        } catch (Exception e) {
            scanStatus.setState(ScanStatus.State.FAILED);
            scanStatus.setErrorMessage(e.getMessage());
            scanStatus.setCompletedAt(LocalDateTime.now());
            log.error("Library scan failed: {}", e.getMessage(), e);
        }
    }

    private void scanFolder(LibraryFolder folder) {
        Path folderPath = Paths.get(folder.getPath());
        if (!Files.isDirectory(folderPath)) {
            log.warn("Folder does not exist or is not a directory: {}", folder.getPath());
            return;
        }

        log.info("Scanning folder: {}", folder.getPath());

        try (Stream<Path> files = Files.walk(folderPath)) {
            files.filter(this::isAudioFile)
                 .forEach(this::processFile);
        } catch (IOException e) {
            log.error("Error walking folder {}: {}", folder.getPath(), e.getMessage());
        }

        // Update folder metadata
        folder.setLastScannedAt(LocalDateTime.now());
        folder.setTrackCount(
                (int) trackRepository.count() // simplified — works for single folder
        );
        libraryFolderRepository.save(folder);
    }

    private void processFile(Path filePath) {
        scanStatus.setCurrentFile(filePath.getFileName().toString());

        try {
            TrackMetadata metadata = metadataService.readMetadata(filePath);
            if (metadata == null) {
                scanStatus.setErrorFiles(scanStatus.getErrorFiles() + 1);
                return;
            }

            // Find or create Artist (per track — this is the track-level artist)
            String artistName = metadata.getArtist() != null ? metadata.getArtist() : "Unknown Artist";
            Artist artist = artistRepository.findByNameIgnoreCase(artistName)
                    .orElseGet(() -> {
                        Artist newArtist = Artist.builder().name(artistName).build();
                        log.debug("New artist: {}", artistName);
                        return artistRepository.save(newArtist);
                    });

            // Album artist — used for album grouping. Falls back to track artist.
            // This prevents compilation albums from fragmenting (e.g. "FM-84; Ollie Wride"
            // vs "FM-84" both map to album artist "FM-84" if ALBUM_ARTIST tag is set).
            String albumArtistName = metadata.getAlbumArtist() != null
                    ? metadata.getAlbumArtist() : artistName;
            Artist albumArtist = albumArtistName.equals(artistName) ? artist
                    : artistRepository.findByNameIgnoreCase(albumArtistName)
                            .orElseGet(() -> {
                                Artist newArtist = Artist.builder().name(albumArtistName).build();
                                log.debug("New album artist: {}", albumArtistName);
                                return artistRepository.save(newArtist);
                            });

            // Find or create Album — keyed by (title, album artist), not track artist
            String albumTitle = metadata.getAlbum() != null ? metadata.getAlbum() : "Unknown Album";
            Album album = albumRepository.findByTitleIgnoreCaseAndArtistId(albumTitle, albumArtist.getId())
                    .orElseGet(() -> {
                        Album newAlbum = Album.builder()
                                .title(albumTitle)
                                .artist(albumArtist)
                                .year(metadata.getYear())
                                .build();
                        log.debug("New album: {} by {}", albumTitle, albumArtistName);
                        return albumRepository.save(newAlbum);
                    });

            // Save cover art if album doesn't have one yet (or if file is missing on disk)
            boolean coverMissing = !album.isHasCoverArt() || coverArtService.getCoverArtPath(album.getId()) == null;
            if (coverMissing && metadata.getCoverArt() != null) {
                String coverPath = coverArtService.saveCoverArt(album.getId(), metadata.getCoverArt());
                if (coverPath != null) {
                    album.setCoverArtPath(coverPath);
                    album.setHasCoverArt(true);
                    albumRepository.save(album);
                }
            }

            // Create or update Track
            String absolutePath = filePath.toAbsolutePath().toString();
            boolean isNew = !trackRepository.existsByFilePath(absolutePath);

            Track track = trackRepository.findByFilePath(absolutePath)
                    .orElse(new Track());

            track.setTitle(metadata.getTitle());
            track.setArtist(artist);
            track.setAlbum(album);
            track.setTrackNumber(metadata.getTrackNumber());
            track.setDiscNumber(metadata.getDiscNumber());
            track.setDuration(metadata.getDurationSeconds());
            track.setFilePath(absolutePath);
            track.setFileSize(metadata.getFileSize());
            track.setBitRate(metadata.getBitRate());
            track.setSampleRate(metadata.getSampleRate());
            track.setBitsPerSample(metadata.getBitsPerSample());
            track.setYear(metadata.getYear());
            track.setGenre(metadata.getGenre());

            trackRepository.save(track);

            if (isNew) {
                scanStatus.setNewTracks(scanStatus.getNewTracks() + 1);
            } else {
                scanStatus.setUpdatedTracks(scanStatus.getUpdatedTracks() + 1);
            }

        } catch (Exception e) {
            log.error("Error processing file {}: {}", filePath, e.getMessage());
            scanStatus.setErrorFiles(scanStatus.getErrorFiles() + 1);
        }

        scanStatus.setProcessedFiles(scanStatus.getProcessedFiles() + 1);
    }

    private static final java.util.Set<String> AUDIO_EXTENSIONS = java.util.Set.of(
            ".flac", ".mp3", ".ogg", ".m4a", ".wav"
    );

    private boolean isAudioFile(Path path) {
        if (!Files.isRegularFile(path)) return false;
        String name = path.getFileName().toString().toLowerCase();
        return AUDIO_EXTENSIONS.stream().anyMatch(name::endsWith);
    }

    private int countAudioFiles(Path folderPath) {
        if (!Files.isDirectory(folderPath)) return 0;
        try (Stream<Path> files = Files.walk(folderPath)) {
            return (int) files.filter(this::isAudioFile).count();
        } catch (IOException e) {
            log.error("Error counting files in {}: {}", folderPath, e.getMessage());
            return 0;
        }
    }

    private void resetStatus() {
        scanStatus.setState(ScanStatus.State.IDLE);
        scanStatus.setTotalFiles(0);
        scanStatus.setProcessedFiles(0);
        scanStatus.setErrorFiles(0);
        scanStatus.setNewTracks(0);
        scanStatus.setUpdatedTracks(0);
        scanStatus.setCurrentFile(null);
        scanStatus.setErrorMessage(null);
        scanStatus.setStartedAt(null);
        scanStatus.setCompletedAt(null);
    }

    /**
     * Remove tracks whose files no longer exist on disk.
     */
    public int removeOrphanTracks() {
        List<Track> allTracks = trackRepository.findAll();
        int removed = 0;
        for (Track track : allTracks) {
            Path path = Paths.get(track.getFilePath());
            if (!Files.exists(path)) {
                log.debug("Removing orphan track: {} ({})", track.getTitle(), track.getFilePath());
                trackRepository.delete(track);
                removed++;
            }
        }
        cleanupOrphanAlbumsAndArtists();
        return removed;
    }

    /**
     * Remove albums with no tracks and artists with no tracks and no albums.
     * Called after track deletion or full rescan to keep the library clean.
     */
    public void cleanupOrphanAlbumsAndArtists() {
        // Remove albums with no tracks
        var allAlbums = albumRepository.findAll();
        int albumsRemoved = 0;
        for (var album : allAlbums) {
            if (trackRepository.countByAlbumId(album.getId()) == 0) {
                log.debug("Removing orphan album: {} (id={})", album.getTitle(), album.getId());
                albumRepository.delete(album);
                albumsRemoved++;
            }
        }

        // Remove artists with no tracks and no albums
        var allArtists = artistRepository.findAll();
        int artistsRemoved = 0;
        for (var art : allArtists) {
            if (trackRepository.countByArtistId(art.getId()) == 0
                    && albumRepository.countByArtistId(art.getId()) == 0) {
                log.debug("Removing orphan artist: {} (id={})", art.getName(), art.getId());
                artistRepository.delete(art);
                artistsRemoved++;
            }
        }

        if (albumsRemoved > 0 || artistsRemoved > 0) {
            log.info("Cleanup: {} orphan albums, {} orphan artists removed", albumsRemoved, artistsRemoved);
        }
    }
}
