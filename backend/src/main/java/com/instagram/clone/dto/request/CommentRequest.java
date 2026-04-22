package com.instagram.clone.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentRequest {
    private Long userId;
    private Long postId;
    private String text;
    private String pictureUrl;
    private LocalDateTime postedAt;
}