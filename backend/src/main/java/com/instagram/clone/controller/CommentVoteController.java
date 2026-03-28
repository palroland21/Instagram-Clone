package com.instagram.clone.controller;

import com.instagram.clone.model.CommentVote;
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
    public CommentVote create(@RequestBody CommentVote commentVote) {
        return commentVoteService.create(commentVote);
    }

    @GetMapping("/{id}")
    public CommentVote getById(@PathVariable Long id) {
        return commentVoteService.getById(id);
    }

    @GetMapping
    public List<CommentVote> getAll() {
        return commentVoteService.getAll();
    }

    @PutMapping("/{id}")
    public CommentVote update(@PathVariable Long id, @RequestBody CommentVote updatedCommentVote) {
        return commentVoteService.update(id, updatedCommentVote);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        commentVoteService.delete(id);
        return "CommentVote deleted successfully";
    }
}
