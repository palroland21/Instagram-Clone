package com.instagram.clone.service;

import com.instagram.clone.dto.request.AdminCommentEditRequest;
import com.instagram.clone.dto.request.AdminPostEditRequest;
import com.instagram.clone.dto.response.AdminUserResponse;
import com.instagram.clone.model.Comment;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.User;
import com.instagram.clone.repository.CommentRepository;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InternalAdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final InternalNotificationService internalNotificationService;

    public List<AdminUserResponse> getAllUsers() {
        List<AdminUserResponse> users = new ArrayList<>();

        for (User user : userRepository.findAll()) {
            users.add(new AdminUserResponse(user));
        }

        return users;
    }

    public void banUser(Long userId) {
        User user = getUserOrThrow(userId);

        user.setBanned(true);
        userRepository.save(user);

        internalNotificationService.sendBanNotifications(user);
    }

    public void unbanUser(Long userId) {
        User user = getUserOrThrow(userId);

        user.setBanned(false);
        userRepository.save(user);
    }

    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found."));

        postRepository.delete(post);
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found."));

        commentRepository.delete(comment);
    }

    public void editPost(Long postId, AdminPostEditRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found."));

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            post.setTitle(request.getTitle());
        }

        if (request.getText() != null && !request.getText().isBlank()) {
            post.setCaption(request.getText());
        }

        postRepository.save(post);
    }

    public void editComment(Long commentId, AdminCommentEditRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found."));

        if (request.getText() != null && !request.getText().isBlank()) {
            comment.setText(request.getText());
        }

        commentRepository.save(comment);
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));
    }
}