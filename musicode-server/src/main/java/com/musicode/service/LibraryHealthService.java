package com.musicode.service;

import com.musicode.model.dto.HealthIssue;
import com.musicode.model.dto.HealthIssueType;
import com.musicode.model.dto.HealthSummary;
import com.musicode.model.entity.Album;
import com.musicode.model.entity.Track;
import com.musicode.repository.AlbumRepository;
import com.musicode.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LibraryHealthService {

    private final TrackRepository trackRepository;
    private final AlbumRepository albumRepository;

    public HealthSummary getSummary() {
        Map<HealthIssueType, Long> counts = new EnumMap<>(HealthIssueType.class);

        counts.put(HealthIssueType.MISSING_ARTIST, trackRepository.countWithMissingArtist());
        counts.put(HealthIssueType.MISSING_ALBUM, trackRepository.countWithMissingAlbum());
        counts.put(HealthIssueType.MISSING_TITLE, countWithTitleMatchingFilename());
        counts.put(HealthIssueType.MISSING_TRACK_NUMBER, trackRepository.countWithMissingTrackNumber());
        counts.put(HealthIssueType.MISSING_YEAR, trackRepository.countWithMissingYear());
        counts.put(HealthIssueType.MISSING_GENRE, trackRepository.countWithMissingGenre());
        counts.put(HealthIssueType.MISSING_COVER_ART, albumRepository.countByHasCoverArtFalse());

        long totalIssues = counts.values().stream().mapToLong(Long::longValue).sum();

        return new HealthSummary(
                trackRepository.count(),
                albumRepository.count(),
                totalIssues,
                counts
        );
    }

    public Page<HealthIssue> getIssues(HealthIssueType type, Pageable pageable) {
        return switch (type) {
            case MISSING_ARTIST -> trackRepository.findWithMissingArtist(pageable)
                    .map(t -> trackIssue(t, type, "Artist is 'Unknown Artist'"));
            case MISSING_ALBUM -> trackRepository.findWithMissingAlbum(pageable)
                    .map(t -> trackIssue(t, type, "Album is 'Unknown Album'"));
            case MISSING_TITLE -> findWithTitleMatchingFilename(pageable);
            case MISSING_TRACK_NUMBER -> trackRepository.findWithMissingTrackNumber(pageable)
                    .map(t -> trackIssue(t, type, "No track number"));
            case MISSING_YEAR -> trackRepository.findWithMissingYear(pageable)
                    .map(t -> trackIssue(t, type, "No release year"));
            case MISSING_GENRE -> trackRepository.findWithMissingGenre(pageable)
                    .map(t -> trackIssue(t, type, "No genre"));
            case MISSING_COVER_ART -> albumRepository.findByHasCoverArtFalse(pageable)
                    .map(this::albumCoverIssue);
        };
    }

    private HealthIssue trackIssue(Track t, HealthIssueType type, String detail) {
        return new HealthIssue(
                type,
                t.getId(),
                t.getTitle(),
                detail,
                t.getFilePath()
        );
    }

    private HealthIssue albumCoverIssue(Album a) {
        return new HealthIssue(
                HealthIssueType.MISSING_COVER_ART,
                a.getId(),
                a.getTitle() + " — " + a.getArtist().getName(),
                "No cover art",
                null
        );
    }

    private long countWithTitleMatchingFilename() {
        return trackRepository.findAll().stream()
                .filter(this::titleMatchesFilename)
                .count();
    }

    private Page<HealthIssue> findWithTitleMatchingFilename(Pageable pageable) {
        List<Track> all = trackRepository.findAll();
        List<HealthIssue> matching = all.stream()
                .filter(this::titleMatchesFilename)
                .map(t -> trackIssue(t, HealthIssueType.MISSING_TITLE, "Title matches filename"))
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), matching.size());
        List<HealthIssue> page = start < matching.size() ? matching.subList(start, end) : List.of();
        return new PageImpl<>(page, pageable, matching.size());
    }

    private boolean titleMatchesFilename(Track track) {
        if (track.getTitle() == null || track.getFilePath() == null) return false;
        Path path = Paths.get(track.getFilePath());
        String filename = path.getFileName().toString();
        String stem = filename.contains(".") ? filename.substring(0, filename.lastIndexOf('.')) : filename;
        return track.getTitle().equalsIgnoreCase(stem);
    }
}
