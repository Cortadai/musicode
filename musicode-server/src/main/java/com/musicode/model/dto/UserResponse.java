package com.musicode.model.dto;

import com.musicode.model.entity.Role;
import com.musicode.model.entity.User;

public record UserResponse(
        Long id,
        String username,
        Role role,
        boolean enabled
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getRole(), user.isEnabled());
    }
}
