package com.instagram.clone.service;

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

    public Comment create(Comment comment) {
        User user = userRepository.findById(comment.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(comment.getPost().getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        comment.setUser(user);
        comment.setPost(post);
        comment.setPostedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public Comment getById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
    }

    public List<Comment> getAll() {
        return (List<Comment>) commentRepository.findAll();
    }

    public Comment update(Long id, Comment updatedComment) {
        Comment existing = getById(id);
        existing.setUser(updatedComment.getUser());
        existing.setPost(updatedComment.getPost());
        existing.setText(updatedComment.getText());
        existing.setPictureUrl(updatedComment.getPictureUrl());
        return commentRepository.save(existing);
    }

    public void delete(Long id) {
        commentRepository.deleteById(id);
    }
}