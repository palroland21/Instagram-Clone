package com.instagram.clone.controller;

import com.instagram.clone.model.Comment;
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
    public Comment create(@RequestBody Comment comment) {
        return commentService.create(comment);
    }

    @GetMapping("/{id}")
    public Comment getById(@PathVariable Long id) {
        return commentService.getById(id);
    }

    @GetMapping
    public List<Comment> getAll() {
        return commentService.getAll();
    }

    @PutMapping("/{id}")
    public Comment update(@PathVariable Long id, @RequestBody Comment updatedComment) {
        return commentService.update(id, updatedComment);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        commentService.delete(id);
        return "Comment deleted successfully";
    }
}
