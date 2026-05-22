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

    @GetMapping("/user/{userId}")
    public List<PostResponse> getByUserId(
            @PathVariable Long userId,
            @RequestParam(required = false) Long currentUserId,
            @RequestParam(required = false, defaultValue = "false") boolean excludeTestData
    ) {
        return postService.getByUserId(userId, currentUserId, excludeTestData);
    }

    @GetMapping
    public List<PostResponse> getAll(
            @RequestParam(required = false) Long currentUserId,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String text,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false, defaultValue = "false") boolean onlyMine,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false, defaultValue = "false") boolean excludeTestData
    ) {
        Long authorFilterId = onlyMine ? currentUserId : userId;

        if (hasValue(tag) || hasValue(text) || authorFilterId != null) {
            return postService.search(tag, text, authorFilterId, currentUserId);
        }

        if (page != null || size != null || excludeTestData) {
            return postService.getFeedPage(
                    currentUserId,
                    page != null ? page : 0,
                    size != null ? size : 12,
                    excludeTestData
            );
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

    @PatchMapping("/{id}/close-comments")
    public PostResponse closeComments(@PathVariable Long id, @RequestParam Long userId) {
        return postService.closeComments(id, userId);
    }

    @PostMapping("/{id}/close-comments")
    public PostResponse closeCommentsWithPost(@PathVariable Long id, @RequestParam Long userId) {
        return postService.closeComments(id, userId);
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
