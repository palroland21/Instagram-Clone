package com.instagram.clone.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private Long userId;
    private String username;
    private String userProfilePicture;
    private Long postId;
    private String text;
    private String pictureUrl;
    private LocalDateTime postedAt;

    private int likeCount;
    private int dislikeCount;
    private int voteCount;

    private boolean likedByCurrentUser;
    private boolean dislikedByCurrentUser;
}