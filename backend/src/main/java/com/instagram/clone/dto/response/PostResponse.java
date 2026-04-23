package com.instagram.clone.dto.response;

import com.instagram.clone.model.enums.PostStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {
    private Long id;
    private Long userId;
    private String username;
    private List<String> pictureUrls;
    private String location;
    private String caption;
    private String title;
    private LocalDateTime createdAt;
    private PostStatus status;
    private List<Long> tagIds;
    private List<String> tagNames;
    private Long likeCount;
    private Boolean likedByCurrentUser;
    private List<CommentResponse> comments;
}