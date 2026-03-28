package com.instagram.clone.service;

import com.instagram.clone.model.Comment;
import com.instagram.clone.model.CommentVote;
import com.instagram.clone.model.User;
import com.instagram.clone.repository.CommentRepository;
import com.instagram.clone.repository.CommentVoteRepository;
import com.instagram.clone.repository.UserRepository;
import org.springframework.stereotype.Service;

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

    public CommentVote create(CommentVote commentVote) {
        User user = userRepository.findById(commentVote.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Comment comment = commentRepository.findById(commentVote.getComment().getId())
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentVote.setUser(user);
        commentVote.setComment(comment);
        return commentVoteRepository.save(commentVote);
    }

    public CommentVote getById(Long id) {
        return commentVoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CommentVote not found with id: " + id));
    }

    public List<CommentVote> getAll() {
        return (List<CommentVote>) commentVoteRepository.findAll();
    }

    public CommentVote update(Long id, CommentVote updatedCommentVote) {
        CommentVote existing = getById(id);
        existing.setUser(updatedCommentVote.getUser());
        existing.setComment(updatedCommentVote.getComment());
        existing.setVoteType(updatedCommentVote.getVoteType());
        return commentVoteRepository.save(existing);
    }

    public void delete(Long id) {
        commentVoteRepository.deleteById(id);
    }
}