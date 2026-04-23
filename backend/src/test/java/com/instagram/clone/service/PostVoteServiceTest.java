package com.instagram.clone.service;

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

import java.util.Map;
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
    private User postAuthor;
    private Post testPost;
    private PostVote testPostVote;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);

        postAuthor = new User();
        postAuthor.setId(2L);

        testPost = new Post();
        testPost.setId(10L);
        testPost.setUser(postAuthor);

        testPostVote = new PostVote();
        testPostVote.setId(100L);
        testPostVote.setUser(testUser);
        testPostVote.setPost(testPost);
        testPostVote.setVoteType(VoteType.LIKE);
    }

    @Test
    void toggleLike_ShouldCreateLike_WhenVoteDoesNotExist() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.findById(10L)).thenReturn(Optional.of(testPost));
        when(postVoteRepository.findByUserIdAndPostId(1L, 10L)).thenReturn(Optional.empty());
        when(postVoteRepository.countByPostIdAndVoteType(10L, VoteType.LIKE)).thenReturn(1L);

        Map<String, Object> result = postVoteService.toggleLike(1L, 10L);

        assertNotNull(result);
        assertEquals(true, result.get("liked"));
        assertEquals(1L, result.get("likeCount"));

        verify(userRepository).findById(1L);
        verify(postRepository).findById(10L);
        verify(postVoteRepository).findByUserIdAndPostId(1L, 10L);
        verify(postVoteRepository).save(any(PostVote.class));
    }

    @Test
    void toggleLike_ShouldDeleteLike_WhenLikeAlreadyExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.findById(10L)).thenReturn(Optional.of(testPost));
        when(postVoteRepository.findByUserIdAndPostId(1L, 10L)).thenReturn(Optional.of(testPostVote));
        when(postVoteRepository.countByPostIdAndVoteType(10L, VoteType.LIKE)).thenReturn(0L);

        Map<String, Object> result = postVoteService.toggleLike(1L, 10L);

        assertNotNull(result);
        assertEquals(false, result.get("liked"));
        assertEquals(0L, result.get("likeCount"));

        verify(postVoteRepository).delete(testPostVote);
        verify(postVoteRepository, never()).save(any(PostVote.class));
    }

    @Test
    void toggleLike_ShouldConvertDislikeToLike_WhenVoteExistsButIsDislike() {
        testPostVote.setVoteType(VoteType.DISLIKE);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.findById(10L)).thenReturn(Optional.of(testPost));
        when(postVoteRepository.findByUserIdAndPostId(1L, 10L)).thenReturn(Optional.of(testPostVote));
        when(postVoteRepository.countByPostIdAndVoteType(10L, VoteType.LIKE)).thenReturn(1L);

        Map<String, Object> result = postVoteService.toggleLike(1L, 10L);

        assertNotNull(result);
        assertEquals(true, result.get("liked"));
        assertEquals(1L, result.get("likeCount"));
        assertEquals(VoteType.LIKE, testPostVote.getVoteType());

        verify(postVoteRepository).save(testPostVote);
        verify(postVoteRepository, never()).delete(any(PostVote.class));
    }

    @Test
    void toggleLike_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> postVoteService.toggleLike(1L, 10L)
        );

        assertEquals("User not found", exception.getMessage());

        verify(postRepository, never()).findById(any());
        verify(postVoteRepository, never()).save(any());
    }

    @Test
    void toggleLike_ShouldThrowException_WhenPostNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(postRepository.findById(10L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> postVoteService.toggleLike(1L, 10L)
        );

        assertEquals("Post not found", exception.getMessage());

        verify(postVoteRepository, never()).save(any());
        verify(postVoteRepository, never()).delete(any());
    }

    @Test
    void getLikeCount_ShouldReturnCount() {
        when(postVoteRepository.countByPostIdAndVoteType(10L, VoteType.LIKE)).thenReturn(5L);

        long result = postVoteService.getLikeCount(10L);

        assertEquals(5L, result);
        verify(postVoteRepository).countByPostIdAndVoteType(10L, VoteType.LIKE);
    }

    @Test
    void isLikedByUser_ShouldReturnTrue_WhenLikeExists() {
        when(postVoteRepository.findByUserIdAndPostId(1L, 10L)).thenReturn(Optional.of(testPostVote));

        boolean result = postVoteService.isLikedByUser(1L, 10L);

        assertTrue(result);
    }

    @Test
    void isLikedByUser_ShouldReturnFalse_WhenVoteDoesNotExist() {
        when(postVoteRepository.findByUserIdAndPostId(1L, 10L)).thenReturn(Optional.empty());

        boolean result = postVoteService.isLikedByUser(1L, 10L);

        assertFalse(result);
    }

    @Test
    void isLikedByUser_ShouldReturnFalse_WhenVoteIsDislike() {
        testPostVote.setVoteType(VoteType.DISLIKE);

        when(postVoteRepository.findByUserIdAndPostId(1L, 10L)).thenReturn(Optional.of(testPostVote));

        boolean result = postVoteService.isLikedByUser(1L, 10L);

        assertFalse(result);
    }
}