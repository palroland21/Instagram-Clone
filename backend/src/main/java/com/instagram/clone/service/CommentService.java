package com.instagram.clone.service;

import com.instagram.clone.dto.request.CommentRequest;
import com.instagram.clone.dto.response.CommentResponse;
import com.instagram.clone.model.Comment;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.User;
import com.instagram.clone.repository.CommentRepository;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository,
                          UserRepository userRepository,
                          PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public CommentResponse create(CommentRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setText(request.getText());
        comment.setPictureUrl(request.getPictureUrl());
        comment.setPostedAt(request.getPostedAt() != null ? request.getPostedAt() : LocalDateTime.now());

        Comment saved = commentRepository.save(comment);
        return mapToResponse(saved);
    }

    public CommentResponse getById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        return mapToResponse(comment);
    }

    public List<CommentResponse> getAll() {
        List<CommentResponse> responses = new java.util.ArrayList<>();

        for (Comment comment : commentRepository.findAll()) {
            responses.add(mapToResponse(comment));
        }

        return responses;
    }

    public CommentResponse update(Long id, CommentRequest request) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        comment.setUser(user);
        comment.setPost(post);
        comment.setText(request.getText());
        comment.setPictureUrl(request.getPictureUrl());
        comment.setPostedAt(request.getPostedAt());

        Comment updated = commentRepository.save(comment);
        return mapToResponse(updated);
    }

    public void delete(Long id) {
        commentRepository.deleteById(id);
    }

    private CommentResponse mapToResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setUserId(comment.getUser().getId());
        response.setUsername(comment.getUser().getUsername());
        response.setPostId(comment.getPost().getId());
        response.setText(comment.getText());
        response.setPictureUrl(comment.getPictureUrl());
        response.setPostedAt(comment.getPostedAt());
        return response;
    }
}