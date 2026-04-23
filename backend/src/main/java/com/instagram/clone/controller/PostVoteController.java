package com.instagram.clone.controller;

import com.instagram.clone.dto.response.PostVoteToggleResponse;
import com.instagram.clone.model.enums.VoteType;
import com.instagram.clone.service.PostVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/post-votes")
@RequiredArgsConstructor
public class PostVoteController {

    private final PostVoteService postVoteService;

    @PostMapping("/toggle")
    public PostVoteToggleResponse toggleVote(
            @RequestParam Long userId,
            @RequestParam Long postId,
            @RequestParam VoteType voteType
    ) {
        return postVoteService.toggleVote(userId, postId, voteType);
    }

    @GetMapping("/count/likes/{postId}")
    public long getLikeCount(@PathVariable Long postId) {
        return postVoteService.getLikeCount(postId);
    }

    @GetMapping("/count/dislikes/{postId}")
    public long getDislikeCount(@PathVariable Long postId) {
        return postVoteService.getDislikeCount(postId);
    }

    @GetMapping("/count/score/{postId}")
    public long getVoteCount(@PathVariable Long postId) {
        return postVoteService.getVoteCount(postId);
    }

    @GetMapping("/liked")
    public boolean isLikedByUser(@RequestParam Long userId, @RequestParam Long postId) {
        return postVoteService.isLikedByUser(userId, postId);
    }

    @GetMapping("/disliked")
    public boolean isDislikedByUser(@RequestParam Long userId, @RequestParam Long postId) {
        return postVoteService.isDislikedByUser(userId, postId);
    }
}