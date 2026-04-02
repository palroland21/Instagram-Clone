package com.instagram.clone.service;

import com.instagram.clone.model.Comment;
import com.instagram.clone.model.CommentVote;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.VoteType;
import com.instagram.clone.repository.CommentRepository;
import com.instagram.clone.repository.CommentVoteRepository;
import com.instagram.clone.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentVoteServiceTest {

    @Mock
    private CommentVoteRepository commentVoteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentVoteService commentVoteService;

    @Test
    void create_ShouldReturnSavedCommentVote() {
        User user = new User();
        user.setId(1L);

        Comment comment = new Comment();
        comment.setId(10L);

        CommentVote vote = new CommentVote();
        vote.setUser(user);
        vote.setComment(comment);
        vote.setVoteType(VoteType.LIKE);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(commentRepository.findById(10L)).thenReturn(Optional.of(comment));
        when(commentVoteRepository.save(any(CommentVote.class))).thenReturn(vote);

        CommentVote saved = commentVoteService.create(vote);

        assertNotNull(saved);
        assertEquals(VoteType.LIKE, saved.getVoteType());
    }
}