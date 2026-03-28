package com.instagram.clone.controller;

import com.instagram.clone.model.PostVote;
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
    public PostVote create(@RequestBody PostVote postVote) {
        return postVoteService.create(postVote);
    }

    @GetMapping("/{id}")
    public PostVote getById(@PathVariable Long id) {
        return postVoteService.getById(id);
    }

    @GetMapping
    public List<PostVote> getAll() {
        return postVoteService.getAll();
    }

    @PutMapping("/{id}")
    public PostVote update(@PathVariable Long id, @RequestBody PostVote updatedPostVote) {
        return postVoteService.update(id, updatedPostVote);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        postVoteService.delete(id);
        return "PostVote deleted successfully";
    }
}