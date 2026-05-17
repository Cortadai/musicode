package com.musicode.repository;

import com.musicode.model.entity.VideoFolder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoFolderRepository extends JpaRepository<VideoFolder, Long> {
    boolean existsByPath(String path);
}
