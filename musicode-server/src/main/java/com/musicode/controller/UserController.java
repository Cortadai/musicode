package com.musicode.controller;

import com.musicode.model.dto.CreateUserRequest;
import com.musicode.model.dto.UpdateUserRequest;
import com.musicode.model.dto.UserResponse;
import com.musicode.model.entity.User;
import com.musicode.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok((Object) UserResponse.from(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "Username already exists: " + request.username()));
        }

        var user = User.builder()
                .username(request.username())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(request.role())
                .build();

        user = userRepository.save(user);
        log.info("Created user '{}' with role {}", user.getUsername(), user.getRole());
        return ResponseEntity.status(201).body(UserResponse.from(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var user = userOpt.get();

        if (request.username() != null && !request.username().isBlank()) {
            if (!user.getUsername().equals(request.username()) && userRepository.existsByUsername(request.username())) {
                return ResponseEntity.status(409)
                        .body(Map.of("error", "Username already exists: " + request.username()));
            }
            user.setUsername(request.username());
        }

        if (request.role() != null) {
            user.setRole(request.role());
        }

        if (request.enabled() != null) {
            user.setEnabled(request.enabled());
        }

        if (request.password() != null && !request.password().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.password()));
        }

        user = userRepository.save(user);
        log.info("Updated user '{}' (id={})", user.getUsername(), user.getId());
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, java.security.Principal principal) {
        var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var user = userOpt.get();

        // Prevent admin from deleting themselves
        if (user.getUsername().equals(principal.getName())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cannot delete your own account"));
        }

        userRepository.delete(user);
        log.info("Deleted user '{}' (id={})", user.getUsername(), user.getId());
        return ResponseEntity.ok(Map.of("deleted", id));
    }
}
