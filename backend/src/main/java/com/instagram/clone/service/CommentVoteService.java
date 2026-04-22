package com.instagram.clone.service;

import com.instagram.clone.dto.request.CommentVoteRequest;
import com.instagram.clone.dto.response.CommentVoteResponse;
import com.instagram.clone.model.Comment;
import com.instagram.clone.model.CommentVote;
import com.instagram.clone.model.User;
import com.instagram.clone.repository.CommentRepository;
import com.instagram.clone.repository.CommentVoteRepository;
import com.instagram.clone.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentVoteService {

    private final CommentVoteRepository commentVoteRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public CommentVoteService(CommentVoteRepository commentVoteRepository,
                              UserRepository userRepository,
                              CommentRepository commentRepository) {
        this.commentVoteRepository = commentVoteRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public CommentVoteResponse create(CommentVoteRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        CommentVote commentVote = new CommentVote();
        commentVote.setUser(user);
        commentVote.setComment(comment);
        commentVote.setVoteType(request.getVoteType());

        CommentVote saved = commentVoteRepository.save(commentVote);
        return mapToResponse(saved);
    }

    public CommentVoteResponse getById(Long id) {
        CommentVote commentVote = commentVoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CommentVote not found with id: " + id));
        return mapToResponse(commentVote);
    }

    public List<CommentVoteResponse> getAll() {
        List<CommentVoteResponse> responses = new ArrayList<>();

        for (CommentVote vote : commentVoteRepository.findAll()) {
            responses.add(mapToResponse(vote));
        }

        return responses;
    }

    public CommentVoteResponse update(Long id, CommentVoteRequest request) {
        CommentVote existing = commentVoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CommentVote not found with id: " + id));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        existing.setUser(user);
        existing.setComment(comment);
        existing.setVoteType(request.getVoteType());

        CommentVote updated = commentVoteRepository.save(existing);
        return mapToResponse(updated);
    }

    public void delete(Long id) {
        commentVoteRepository.deleteById(id);
    }

    private CommentVoteResponse mapToResponse(CommentVote commentVote) {
        CommentVoteResponse response = new CommentVoteResponse();
        response.setId(commentVote.getId());
        response.setUserId(commentVote.getUser().getId());
        response.setUsername(commentVote.getUser().getUsername());
        response.setCommentId(commentVote.getComment().getId());
        response.setCommentText(commentVote.getComment().getText());
        response.setVoteType(commentVote.getVoteType());
        return response;
    }
}