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
    public CommentResponse getById(
            @PathVariable Long id,
            @RequestParam(required = false) Long currentUserId
    ) {
        return commentService.getById(id, currentUserId);
    }

    @GetMapping
    public List<CommentResponse> getAll(
            @RequestParam(required = false) Long currentUserId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false, defaultValue = "false") boolean excludeTestData
    ) {
        if (page != null || size != null || excludeTestData) {
            return commentService.getPage(
                    currentUserId,
                    page != null ? page : 0,
                    size != null ? size : 20,
                    excludeTestData
            );
        }

        return commentService.getAll(currentUserId);
    }

    @GetMapping("/post/{postId}")
    public List<CommentResponse> getByPostId(
            @PathVariable Long postId,
            @RequestParam(required = false) Long currentUserId
    ) {
        return commentService.getByPostId(postId, currentUserId);
    }

    @PutMapping("/{id}")
    public CommentResponse update(@PathVariable Long id, @RequestBody CommentRequest request) {
        return commentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id, @RequestParam Long userId) {
        commentService.delete(id, userId);
        return "Comment deleted successfully";
    }
}
