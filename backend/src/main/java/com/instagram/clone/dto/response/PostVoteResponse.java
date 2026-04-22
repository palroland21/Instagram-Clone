package com.instagram.clone.dto.response;

import com.instagram.clone.model.enums.VoteType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostVoteResponse {
    private Long id;
    private Long userId;
    private Long postId;
    private VoteType voteType;
}
