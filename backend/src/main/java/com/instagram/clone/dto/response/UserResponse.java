package com.instagram.clone.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String profilePicture;
    private String phoneNumber;
    private LocalDateTime createdAt;
}