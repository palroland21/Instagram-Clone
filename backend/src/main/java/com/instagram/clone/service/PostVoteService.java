package com.instagram.clone.service;

import com.instagram.clone.dto.request.PostVoteRequest;
import com.instagram.clone.dto.response.PostVoteResponse;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.PostVote;
import com.instagram.clone.model.User;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.PostVoteRepository;
import com.instagram.clone.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostVoteService {

    private final PostVoteRepository postVoteRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public PostVoteService(PostVoteRepository postVoteRepository,
                           UserRepository userRepository,
                           PostRepository postRepository) {
        this.postVoteRepository = postVoteRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public PostVoteResponse create(PostVoteRequest postVoteRequest) {
        User user = userRepository.findById(postVoteRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + postVoteRequest.getUserId()));

        Post post = postRepository.findById(postVoteRequest.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postVoteRequest.getPostId()));

        PostVote postVote = new PostVote();
        postVote.setUser(user);
        postVote.setPost(post);
        postVote.setVoteType(postVoteRequest.getVoteType());

        PostVote savedPostVote = postVoteRepository.save(postVote);
        return mapToResponse(savedPostVote);
    }

    public PostVoteResponse getById(Long id) {
        PostVote postVote = postVoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PostVote not found with id: " + id));

        return mapToResponse(postVote);
    }

    public List<PostVoteResponse> getAll() {
        List<PostVoteResponse> votes = new ArrayList<>();

        for (PostVote postVote : postVoteRepository.findAll()) {
            votes.add(mapToResponse(postVote));
        }

        return votes;
    }

    public PostVoteResponse update(Long id, PostVoteRequest postVoteRequest) {
        PostVote existing = postVoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PostVote not found with id: " + id));

        User user = userRepository.findById(postVoteRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + postVoteRequest.getUserId()));

        Post post = postRepository.findById(postVoteRequest.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postVoteRequest.getPostId()));

        existing.setUser(user);
        existing.setPost(post);
        existing.setVoteType(postVoteRequest.getVoteType());

        PostVote updatedPostVote = postVoteRepository.save(existing);
        return mapToResponse(updatedPostVote);
    }

    public void delete(Long id) {
        PostVote postVote = postVoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PostVote not found with id: " + id));

        postVoteRepository.delete(postVote);
    }

    private PostVoteResponse mapToResponse(PostVote postVote) {
        return new PostVoteResponse(
                postVote.getId(),
                postVote.getUser() != null ? postVote.getUser().getId() : null,
                postVote.getPost() != null ? postVote.getPost().getId() : null,
                postVote.getVoteType()
        );
    }
}