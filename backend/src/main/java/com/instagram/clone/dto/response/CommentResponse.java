package com.instagram.clone.dto.response;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private Long userId;
    private String username;
    private Long postId;
    private String text;
    private String pictureUrl;
    private LocalDateTime postedAt;
}