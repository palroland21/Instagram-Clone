package com.instagram.clone.service;

import com.instagram.clone.model.Post;
import com.instagram.clone.model.PostVote;
import com.instagram.clone.model.User;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.PostVoteRepository;
import com.instagram.clone.repository.UserRepository;
import org.springframework.stereotype.Service;

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

    public PostVote create(PostVote postVote) {
        User user = userRepository.findById(postVote.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postVote.getPost().getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        postVote.setUser(user);
        postVote.setPost(post);
        return postVoteRepository.save(postVote);
    }

    public PostVote getById(Long id) {
        return postVoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PostVote not found with id: " + id));
    }

    public List<PostVote> getAll() {
        return (List<PostVote>) postVoteRepository.findAll();
    }

    public PostVote update(Long id, PostVote updatedPostVote) {
        PostVote existing = getById(id);
        existing.setUser(updatedPostVote.getUser());
        existing.setPost(updatedPostVote.getPost());
        existing.setVoteType(updatedPostVote.getVoteType());
        return postVoteRepository.save(existing);
    }

    public void delete(Long id) {
        postVoteRepository.deleteById(id);
    }
}