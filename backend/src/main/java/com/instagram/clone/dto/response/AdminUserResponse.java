package com.instagram.clone.dto.response;

import com.instagram.clone.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String profilePicture;
    private String role;
    private Double score;
    private Boolean banned;
    private LocalDateTime createdAt;

    public AdminUserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.profilePicture = user.getProfilePicture();
        this.role = user.getRole() != null ? user.getRole().name() : null;
        this.score = user.getScore();
        this.banned = user.getBanned();
        this.createdAt = user.getCreatedAt();
    }
}