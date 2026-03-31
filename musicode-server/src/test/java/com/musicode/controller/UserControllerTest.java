package com.musicode.controller;

import com.musicode.model.entity.Role;
import com.musicode.model.entity.User;
import com.musicode.repository.RefreshTokenRepository;
import com.musicode.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@WithMockUser(username = "admin", roles = "ADMIN")
class UserControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private RefreshTokenRepository refreshTokenRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();

        userRepository.save(User.builder()
                .username("admin")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build());
    }

    @Test
    void listUsers_returnsAll() throws Exception {
        userRepository.save(User.builder()
                .username("listener1")
                .passwordHash(passwordEncoder.encode("pass"))
                .role(Role.LISTENER)
                .build());

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].username", hasItems("admin", "listener1")))
                // Password should never appear
                .andExpect(jsonPath("$[*].passwordHash").doesNotExist())
                .andExpect(jsonPath("$[*].password").doesNotExist());
    }

    @Test
    void getUser_existingId_returnsUser() throws Exception {
        var user = userRepository.findByUsername("admin").orElseThrow();
        mockMvc.perform(get("/api/users/{id}", user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("admin")))
                .andExpect(jsonPath("$.role", is("ADMIN")));
    }

    @Test
    void getUser_nonExistentId_returns404() throws Exception {
        mockMvc.perform(get("/api/users/{id}", 99999))
                .andExpect(status().isNotFound());
    }

    @Test
    void createUser_valid_returns201() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"newuser\",\"password\":\"pass123\",\"role\":\"LISTENER\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username", is("newuser")))
                .andExpect(jsonPath("$.role", is("LISTENER")))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void createUser_duplicateUsername_returns409() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"pass\",\"role\":\"LISTENER\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error", containsString("already exists")));
    }

    @Test
    void createUser_blankUsername_returns400() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"pass\",\"role\":\"LISTENER\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createUser_missingPassword_returns400() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test\",\"role\":\"LISTENER\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateUser_changeRole_returnsUpdated() throws Exception {
        var listener = userRepository.save(User.builder()
                .username("listener1")
                .passwordHash(passwordEncoder.encode("pass"))
                .role(Role.LISTENER)
                .build());

        mockMvc.perform(put("/api/users/{id}", listener.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"role\":\"ADMIN\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role", is("ADMIN")));
    }

    @Test
    void updateUser_disableUser_returnsUpdated() throws Exception {
        var listener = userRepository.save(User.builder()
                .username("listener1")
                .passwordHash(passwordEncoder.encode("pass"))
                .role(Role.LISTENER)
                .build());

        mockMvc.perform(put("/api/users/{id}", listener.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"enabled\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled", is(false)));
    }

    @Test
    void updateUser_nonExistent_returns404() throws Exception {
        mockMvc.perform(put("/api/users/{id}", 99999)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"role\":\"ADMIN\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteUser_existingUser_returnsOk() throws Exception {
        var listener = userRepository.save(User.builder()
                .username("todelete")
                .passwordHash(passwordEncoder.encode("pass"))
                .role(Role.LISTENER)
                .build());

        mockMvc.perform(delete("/api/users/{id}", listener.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deleted", is(listener.getId().intValue())));
    }

    @Test
    void deleteUser_self_returns400() throws Exception {
        var admin = userRepository.findByUsername("admin").orElseThrow();
        mockMvc.perform(delete("/api/users/{id}", admin.getId()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("Cannot delete your own")));
    }

    @Test
    void deleteUser_nonExistent_returns404() throws Exception {
        mockMvc.perform(delete("/api/users/{id}", 99999))
                .andExpect(status().isNotFound());
    }

    // --- LISTENER role denied ---

    @Test
    @WithMockUser(roles = "LISTENER")
    void listener_cannotListUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "LISTENER")
    void listener_cannotCreateUser() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"hack\",\"password\":\"pass\",\"role\":\"ADMIN\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "LISTENER")
    void listener_cannotDeleteUser() throws Exception {
        mockMvc.perform(delete("/api/users/{id}", 1))
                .andExpect(status().isForbidden());
    }
}
