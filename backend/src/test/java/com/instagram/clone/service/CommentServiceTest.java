package com.instagram.clone.service;

import com.instagram.clone.model.Comment;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.User;
import com.instagram.clone.repository.CommentRepository;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private CommentService commentService;

    private User testUser;
    private Post testPost;
    private Comment testComment;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("ion_popescu");

        testPost = new Post();
        testPost.setId(1L);
        testPost.setTitle("Aventura la munte");

        testComment = new Comment();
        testComment.setId(1L);
        testComment.setText("Ce poza superba!");
        testComment.setUser(testUser);
        testComment.setPost(testPost);
    }

    @Test
    void create_ShouldReturnSavedComment_WhenUserAndPostExist() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(commentRepository.save(any(Comment.class))).thenAnswer(i -> i.getArguments()[0]);

        Comment result = commentService.create(testComment);

        assertNotNull(result);
        assertEquals("Ce poza superba!", result.getText());
        assertNotNull(result.getPostedAt());
        assertEquals(testUser, result.getUser());
        assertEquals(testPost, result.getPost());

        verify(userRepository).findById(1L);
        verify(postRepository).findById(1L);
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void create_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> commentService.create(testComment));
        assertEquals("User not found", exception.getMessage());

        verify(commentRepository, never()).save(any());
    }

    @Test
    void create_ShouldThrowException_WhenPostNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> commentService.create(testComment));
        assertEquals("Post not found", exception.getMessage());

        verify(commentRepository, never()).save(any());
    }

    @Test
    void getById_ShouldReturnComment_WhenExists() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(testComment));

        Comment result = commentService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void delete_ShouldCallRepository() {
        commentService.delete(1L);

        verify(commentRepository, times(1)).deleteById(1L);
    }
}