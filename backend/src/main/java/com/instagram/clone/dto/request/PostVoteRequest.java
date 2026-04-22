package com.instagram.clone.dto.request;

import com.instagram.clone.model.enums.VoteType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostVoteRequest {
    private Long userId;
    private Long postId;
    private VoteType voteType;
}
