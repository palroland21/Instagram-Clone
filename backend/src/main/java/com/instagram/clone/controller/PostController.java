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
    public List<PostResponse> getAll(@RequestParam(required = false) Long currentUserId) {
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
    public String delete(@PathVariable Long id) {
        postService.delete(id);
        return "Post deleted successfully";
    }
}