package com.instagram.clone.controller;

import com.instagram.clone.dto.request.PostVoteRequest;
import com.instagram.clone.dto.response.PostVoteResponse;
import com.instagram.clone.service.PostVoteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post-votes")
public class PostVoteController {

    private final PostVoteService postVoteService;

    public PostVoteController(PostVoteService postVoteService) {
        this.postVoteService = postVoteService;
    }

    @PostMapping
    public PostVoteResponse create(@RequestBody PostVoteRequest postVoteRequest) {
        return postVoteService.create(postVoteRequest);
    }

    @GetMapping
    public List<PostVoteResponse> getAll() {
        return postVoteService.getAll();
    }

    @GetMapping("/{id}")
    public PostVoteResponse getById(@PathVariable Long id) {
        return postVoteService.getById(id);
    }

    @PutMapping("/{id}")
    public PostVoteResponse update(@PathVariable Long id, @RequestBody PostVoteRequest updatedPostVote) {
        return postVoteService.update(id, updatedPostVote);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        postVoteService.delete(id);
        return "PostVote deleted successfully";
    }
}