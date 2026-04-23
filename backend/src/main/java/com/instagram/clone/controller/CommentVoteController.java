package com.instagram.clone.controller;

import com.instagram.clone.dto.request.CommentVoteRequest;
import com.instagram.clone.dto.response.CommentVoteResponse;
import com.instagram.clone.dto.response.CommentVoteToggleResponse;
import com.instagram.clone.model.enums.VoteType;
import com.instagram.clone.service.CommentVoteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment-votes")
public class CommentVoteController {

    private final CommentVoteService commentVoteService;

    public CommentVoteController(CommentVoteService commentVoteService) {
        this.commentVoteService = commentVoteService;
    }

    @PostMapping
    public CommentVoteResponse create(@RequestBody CommentVoteRequest request) {
        return commentVoteService.create(request);
    }

    @PostMapping("/toggle")
    public CommentVoteToggleResponse toggleVote(
            @RequestParam Long userId,
            @RequestParam Long commentId,
            @RequestParam VoteType voteType
    ) {
        return commentVoteService.toggleVote(userId, commentId, voteType);
    }

    @GetMapping("/{id}")
    public CommentVoteResponse getById(@PathVariable Long id) {
        return commentVoteService.getById(id);
    }

    @GetMapping
    public List<CommentVoteResponse> getAll() {
        return commentVoteService.getAll();
    }

    @PutMapping("/{id}")
    public CommentVoteResponse update(@PathVariable Long id, @RequestBody CommentVoteRequest request) {
        return commentVoteService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        commentVoteService.delete(id);
        return "CommentVote deleted successfully";
    }
}