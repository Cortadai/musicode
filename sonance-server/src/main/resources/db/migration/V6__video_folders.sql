CREATE TABLE video_folders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(1024) NOT NULL UNIQUE,
    video_count INT DEFAULT 0,
    last_scanned_at TIMESTAMP
);
