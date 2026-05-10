package com.musicode.repository;

import com.musicode.model.entity.LibraryFolder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LibraryFolderRepository extends JpaRepository<LibraryFolder, Long> {

    Optional<LibraryFolder> findByPath(String path);

    boolean existsByPath(String path);
}
