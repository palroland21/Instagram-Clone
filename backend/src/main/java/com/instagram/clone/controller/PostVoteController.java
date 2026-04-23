package com.instagram.clone.controller;

import com.instagram.clone.dto.response.PostVoteResponse;
import com.instagram.clone.service.PostVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/post-votes")
@RequiredArgsConstructor
public class PostVoteController {

    private final PostVoteService postVoteService;

    @PostMapping("/toggle-like")
    public Map<String, Object> toggleLike(@RequestParam Long userId, @RequestParam Long postId) {
        return postVoteService.toggleLike(userId, postId);
    }

    @GetMapping("/count/{postId}")
    public long getLikeCount(@PathVariable Long postId) {
        return postVoteService.getLikeCount(postId);
    }

    @GetMapping("/liked")
    public boolean isLikedByUser(@RequestParam Long userId, @RequestParam Long postId) {
        return postVoteService.isLikedByUser(userId, postId);
    }

    @GetMapping
    public List<PostVoteResponse> getAll() {
        return postVoteService.getAll();
    }
}