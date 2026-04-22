package com.instagram.clone.controller;

import com.instagram.clone.dto.request.CommentRequest;
import com.instagram.clone.dto.response.CommentResponse;
import com.instagram.clone.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public CommentResponse create(@RequestBody CommentRequest request) {
        return commentService.create(request);
    }

    @GetMapping("/{id}")
    public CommentResponse getById(@PathVariable Long id) {
        return commentService.getById(id);
    }

    @GetMapping
    public List<CommentResponse> getAll() {
        return commentService.getAll();
    }

    @PutMapping("/{id}")
    public CommentResponse update(@PathVariable Long id, @RequestBody CommentRequest request) {
        return commentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        commentService.delete(id);
        return "Comment deleted successfully";
    }
}