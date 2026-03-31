package com.musicode.model.dto;

import com.musicode.model.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UpdateUserRequest {

    private String username;

    private Role role;

    private Boolean enabled;

    /** Optional — only set if changing password */
    private String password;
}
