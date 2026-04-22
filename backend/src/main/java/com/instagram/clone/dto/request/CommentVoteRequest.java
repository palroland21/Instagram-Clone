package com.instagram.clone.dto.request;

import com.instagram.clone.model.enums.VoteType;
import lombok.Data;

@Data
public class CommentVoteRequest {
    private Long userId;
    private Long commentId;
    private VoteType voteType;
}