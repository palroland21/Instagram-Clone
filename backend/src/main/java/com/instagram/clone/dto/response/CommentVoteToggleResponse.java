package com.instagram.clone.dto.response;

import lombok.Data;

@Data
public class CommentVoteToggleResponse {
    private Long userId;
    private Long commentId;

    private boolean liked;
    private boolean disliked;

    private int likeCount;
    private int dislikeCount;
    private int voteCount;
}