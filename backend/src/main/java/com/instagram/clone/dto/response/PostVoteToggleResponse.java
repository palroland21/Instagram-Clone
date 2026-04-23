package com.instagram.clone.dto.response;

import lombok.Data;

@Data
public class PostVoteToggleResponse {
    private Long userId;
    private Long postId;

    private boolean liked;
    private boolean disliked;

    private long likeCount;
    private long dislikeCount;
    private long voteCount;
}