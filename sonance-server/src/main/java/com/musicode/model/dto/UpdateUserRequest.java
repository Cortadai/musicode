package com.musicode.model.dto;

import com.musicode.model.entity.Role;

public record UpdateUserRequest(
        String username,
        Role role,
        Boolean enabled,
        String password
) {}
