package com.instagram.clone.controller;

import com.instagram.clone.dto.request.PostRequest;
import com.instagram.clone.dto.response.PostResponse;
import com.instagram.clone.service.PostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public PostResponse create(@RequestBody PostRequest request) {
        return postService.create(request);
    }

    @GetMapping("/{id}")
    public PostResponse getById(
            @PathVariable Long id,
            @RequestParam(required = false) Long currentUserId
    ) {
        return postService.getById(id, currentUserId);
    }

    @GetMapping
    public List<PostResponse> getAll(
            @RequestParam(required = false) Long currentUserId,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String text,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false, defaultValue = "false") boolean onlyMine
    ) {
        Long authorFilterId = onlyMine ? currentUserId : userId;

        if (hasValue(tag) || hasValue(text) || authorFilterId != null) {
            return postService.search(tag, text, authorFilterId, currentUserId);
        }

        if (currentUserId != null) {
            return postService.getAll(currentUserId);
        }

        return postService.getAll();
    }

    @PutMapping("/{id}")
    public PostResponse update(@PathVariable Long id, @RequestBody PostRequest request) {
        return postService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id, @RequestParam Long userId) {
        postService.delete(id, userId);
        return "Post deleted successfully";
    }

    private boolean hasValue(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
