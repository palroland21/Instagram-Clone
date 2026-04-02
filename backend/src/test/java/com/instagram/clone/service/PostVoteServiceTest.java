package com.instagram.clone.service;

import com.instagram.clone.model.Post;
import com.instagram.clone.model.PostVote;
import com.instagram.clone.model.User;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.PostVoteRepository;
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
class PostVoteServiceTest {

    @Mock
    private PostVoteRepository postVoteRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostVoteService postVoteService;

    private User testUser;
    private Post testPost;
    private PostVote testPostVote;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);

        testPost = new Post();
        testPost.setId(1L);

        testPostVote = new PostVote();
        testPostVote.setId(1L);
        testPostVote.setUser(testUser);
        testPostVote.setPost(testPost);
    }

    @Test
    void create_ShouldReturnSavedVote_WhenUserAndPostExist() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(postVoteRepository.save(any(PostVote.class))).thenAnswer(i -> i.getArguments()[0]);

        PostVote result = postVoteService.create(testPostVote);

        assertNotNull(result);
        assertEquals(testUser, result.getUser());
        assertEquals(testPost, result.getPost());

        verify(userRepository).findById(1L);
        verify(postRepository).findById(1L);
        verify(postVoteRepository).save(any(PostVote.class));
    }

    @Test
    void create_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> postVoteService.create(testPostVote));
        assertEquals("User not found", exception.getMessage());

        verify(postVoteRepository, never()).save(any());
    }

    @Test
    void create_ShouldThrowException_WhenPostNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> postVoteService.create(testPostVote));
        assertEquals("Post not found", exception.getMessage());

        verify(postVoteRepository, never()).save(any());
    }

    @Test
    void getById_ShouldReturnVote_WhenExists() {
        when(postVoteRepository.findById(1L)).thenReturn(Optional.of(testPostVote));

        PostVote result = postVoteService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void update_ShouldUpdateFieldsAndSave() {
        when(postVoteRepository.findById(1L)).thenReturn(Optional.of(testPostVote));
        when(postVoteRepository.save(any(PostVote.class))).thenAnswer(i -> i.getArguments()[0]);

        PostVote updatedInfo = new PostVote();
        updatedInfo.setUser(testUser);
        updatedInfo.setPost(testPost);

        PostVote result = postVoteService.update(1L, updatedInfo);

        assertNotNull(result);
        verify(postVoteRepository).save(testPostVote);
    }

    @Test
    void delete_ShouldCallRepository() {
        postVoteService.delete(1L);

        verify(postVoteRepository, times(1)).deleteById(1L);
    }
}