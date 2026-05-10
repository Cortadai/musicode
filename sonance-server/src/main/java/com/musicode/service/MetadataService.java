package com.musicode.service;

import com.musicode.model.dto.TrackMetadata;
import lombok.extern.slf4j.Slf4j;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.images.Artwork;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Path;

@Slf4j
@Service
public class MetadataService {

    /**
     * Reads audio metadata from a file using JAudioTagger.
     *
     * @param filePath path to the audio file
     * @return TrackMetadata with all extracted fields, or null if the file cannot be read
     */
    public TrackMetadata readMetadata(Path filePath) {
        File file = filePath.toFile();
        if (!file.exists() || !file.isFile()) {
            log.warn("File does not exist or is not a file: {}", filePath);
            return null;
        }

        try {
            AudioFile audioFile = AudioFileIO.read(file);
            Tag tag = audioFile.getTag();
            AudioHeader header = audioFile.getAudioHeader();

            TrackMetadata.TrackMetadataBuilder builder = TrackMetadata.builder()
                    .filePath(filePath.toAbsolutePath().toString())
                    .fileSize(file.length())
                    .durationSeconds(header.getTrackLength())
                    .bitRate(parseBitRate(header.getBitRate()))
                    .sampleRate(parseInteger(header.getSampleRate()));

            // Bits per sample — available in header for lossless formats
            try {
                builder.bitsPerSample(header.getBitsPerSample());
            } catch (Exception e) {
                // Not all formats expose bits per sample
            }

            if (tag != null) {
                builder.title(getTagField(tag, FieldKey.TITLE))
                       .artist(getTagField(tag, FieldKey.ARTIST))
                       .albumArtist(getTagField(tag, FieldKey.ALBUM_ARTIST))
                       .album(getTagField(tag, FieldKey.ALBUM))
                       .year(parseInteger(getTagField(tag, FieldKey.YEAR)))
                       .trackNumber(parseInteger(getTagField(tag, FieldKey.TRACK)))
                       .discNumber(parseInteger(getTagField(tag, FieldKey.DISC_NO)))
                       .genre(getTagField(tag, FieldKey.GENRE));

                // Cover art
                Artwork artwork = tag.getFirstArtwork();
                if (artwork != null) {
                    try {
                        builder.coverArt(artwork.getBinaryData())
                               .coverArtMimeType(artwork.getMimeType());
                    } catch (Exception e) {
                        log.debug("Could not read cover art from {}: {}", filePath, e.getMessage());
                    }
                }
            }

            TrackMetadata metadata = builder.build();

            // Fallback: use filename as title if tag is missing
            if (metadata.getTitle() == null || metadata.getTitle().isBlank()) {
                String filename = filePath.getFileName().toString();
                metadata.setTitle(filename.substring(0, filename.lastIndexOf('.')));
            }

            log.debug("Read metadata for: {} — {} by {}", metadata.getTitle(), metadata.getAlbum(), metadata.getArtist());
            return metadata;

        } catch (Exception e) {
            log.error("Failed to read metadata from {} [{}]: {}", filePath, e.getClass().getSimpleName(), e.getMessage());
            return null;
        }
    }

    private String getTagField(Tag tag, FieldKey key) {
        try {
            String value = tag.getFirst(key);
            return (value != null && !value.isBlank()) ? value.trim() : null;
        } catch (Exception e) {
            return null;
        }
    }

    private Integer parseInteger(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            // Handle "3/17" format (track 3 of 17)
            if (value.contains("/")) {
                value = value.split("/")[0];
            }
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer parseBitRate(String bitRate) {
        if (bitRate == null || bitRate.isBlank()) return null;
        try {
            // JAudioTagger may return bitrate as "1411" or "~1411"
            String cleaned = bitRate.replace("~", "").trim();
            return Integer.parseInt(cleaned);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
