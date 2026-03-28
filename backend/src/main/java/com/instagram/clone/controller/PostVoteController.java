package com.instagram.clone.controller;

import com.instagram.clone.model.PostVote;
import com.instagram.clone.service.PostVoteService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<PostVote> create(@RequestBody PostVote postVote) {
        // Folosim metoda 'create' din service-ul tău
        return ResponseEntity.ok(postVoteService.create(postVote));
    }

    @GetMapping
    public ResponseEntity<List<PostVote>> getAll() {
        return ResponseEntity.ok(postVoteService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostVote> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postVoteService.getById(id));
    }
}