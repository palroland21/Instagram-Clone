package com.instagram.clone.service;

import com.instagram.clone.dto.request.PostVoteRequest;
import com.instagram.clone.dto.response.PostVoteResponse;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.PostVote;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.VoteType;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.PostVoteRepository;
import com.instagram.clone.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
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
    private PostVoteRequest testPostVoteRequest;

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
        testPostVote.setVoteType(VoteType.LIKE);

        testPostVoteRequest = new PostVoteRequest();
        testPostVoteRequest.setUserId(1L);
        testPostVoteRequest.setPostId(1L);
        testPostVoteRequest.setVoteType(VoteType.LIKE);
    }

    @Test
    void create_ShouldReturnSavedVote_WhenUserAndPostExist() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(postVoteRepository.save(any(PostVote.class))).thenReturn(testPostVote);

        PostVoteResponse result = postVoteService.create(testPostVoteRequest);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1L, result.getUserId());
        assertEquals(1L, result.getPostId());
        assertEquals(VoteType.LIKE, result.getVoteType());

        verify(userRepository).findById(1L);
        verify(postRepository).findById(1L);
        verify(postVoteRepository).save(any(PostVote.class));
    }

    @Test
    void create_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> postVoteService.create(testPostVoteRequest)
        );

        assertEquals("User not found with id: 1", exception.getMessage());
        verify(postVoteRepository, never()).save(any());
    }

    @Test
    void create_ShouldThrowException_WhenPostNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> postVoteService.create(testPostVoteRequest)
        );

        assertEquals("Post not found with id: 1", exception.getMessage());
        verify(postVoteRepository, never()).save(any());
    }

    @Test
    void getById_ShouldReturnVote_WhenExists() {
        when(postVoteRepository.findById(1L)).thenReturn(Optional.of(testPostVote));

        PostVoteResponse result = postVoteService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1L, result.getUserId());
        assertEquals(1L, result.getPostId());
        assertEquals(VoteType.LIKE, result.getVoteType());
    }

    @Test
    void getById_ShouldThrowException_WhenVoteNotFound() {
        when(postVoteRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> postVoteService.getById(1L)
        );

        assertEquals("PostVote not found with id: 1", exception.getMessage());
    }

    @Test
    void getAll_ShouldReturnAllVotes() {
        List<PostVote> votes = new ArrayList<>();
        votes.add(testPostVote);

        when(postVoteRepository.findAll()).thenReturn(votes);

        List<PostVoteResponse> result = postVoteService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(1L, result.get(0).getUserId());
        assertEquals(1L, result.get(0).getPostId());
        assertEquals(VoteType.LIKE, result.get(0).getVoteType());
    }

    @Test
    void update_ShouldUpdateFieldsAndSave() {
        User newUser = new User();
        newUser.setId(2L);

        Post newPost = new Post();
        newPost.setId(2L);

        PostVote updatedSavedVote = new PostVote();
        updatedSavedVote.setId(1L);
        updatedSavedVote.setUser(newUser);
        updatedSavedVote.setPost(newPost);
        updatedSavedVote.setVoteType(VoteType.DISLIKE);

        PostVoteRequest updateRequest = new PostVoteRequest();
        updateRequest.setUserId(2L);
        updateRequest.setPostId(2L);
        updateRequest.setVoteType(VoteType.DISLIKE);

        when(postVoteRepository.findById(1L)).thenReturn(Optional.of(testPostVote));
        when(userRepository.findById(2L)).thenReturn(Optional.of(newUser));
        when(postRepository.findById(2L)).thenReturn(Optional.of(newPost));
        when(postVoteRepository.save(any(PostVote.class))).thenReturn(updatedSavedVote);

        PostVoteResponse result = postVoteService.update(1L, updateRequest);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(2L, result.getUserId());
        assertEquals(2L, result.getPostId());
        assertEquals(VoteType.DISLIKE, result.getVoteType());

        verify(postVoteRepository).findById(1L);
        verify(userRepository).findById(2L);
        verify(postRepository).findById(2L);
        verify(postVoteRepository).save(any(PostVote.class));
    }

    @Test
    void delete_ShouldCallRepositoryDelete_WhenVoteExists() {
        when(postVoteRepository.findById(1L)).thenReturn(Optional.of(testPostVote));

        postVoteService.delete(1L);

        verify(postVoteRepository).findById(1L);
        verify(postVoteRepository).delete(testPostVote);
    }

    @Test
    void delete_ShouldThrowException_WhenVoteNotFound() {
        when(postVoteRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> postVoteService.delete(1L)
        );

        assertEquals("PostVote not found with id: 1", exception.getMessage());
        verify(postVoteRepository, never()).delete(any());
    }
}