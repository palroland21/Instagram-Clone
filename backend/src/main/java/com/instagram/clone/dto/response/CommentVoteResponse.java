package com.instagram.clone.dto.response;

import com.instagram.clone.model.enums.VoteType;
import lombok.Data;

@Data
public class CommentVoteResponse {
    private Long id;
    private Long userId;
    private String username;
    private Long commentId;
    private String commentText;
    private VoteType voteType;
}