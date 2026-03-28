package com.instagram.clone.controller;

import com.instagram.clone.model.Post;
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
    public Post create(@RequestBody Post post) {
        return postService.create(post);
    }

    @GetMapping("/{id}")
    public Post getById(@PathVariable Long id) {
        return postService.getById(id);
    }

    @GetMapping
    public List<Post> getAll() {
        return postService.getAll();
    }

    @PutMapping("/{id}")
    public Post update(@PathVariable Long id, @RequestBody Post updatedPost) {
        return postService.update(id, updatedPost);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        postService.delete(id);
        return "Post deleted successfully";
    }
}
