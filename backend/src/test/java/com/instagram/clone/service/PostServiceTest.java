package com.instagram.clone.service;

import com.instagram.clone.dto.request.PostRequest;
import com.instagram.clone.dto.response.PostResponse;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.Tag;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.PostStatus;
import com.instagram.clone.model.enums.VoteType;
import com.instagram.clone.repository.CommentRepository;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.PostVoteRepository;
import com.instagram.clone.repository.TagRepository;
import com.instagram.clone.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostVoteRepository postVoteRepository;

    @InjectMocks
    private PostService postService;

    private User testUser;
    private Post testPost;
    private PostRequest testPostRequest;
    private Tag testTag;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("andrei_m");

        testTag = new Tag();
        testTag.setId(1L);
        testTag.setName("travel");

        testPost = new Post();
        testPost.setId(1L);
        testPost.setTitle("Aventura la munte");
        testPost.setCaption("O zi frumoasa la munte!");
        testPost.setLocation("Bucegi, Romania");
        testPost.setPictureUrl("https://example.com/post.jpg");
        testPost.setCreatedAt(LocalDateTime.now());
        testPost.setStatus(PostStatus.JUST_POSTED);
        testPost.setUser(testUser);
        testPost.setTags(List.of(testTag));

        testPostRequest = new PostRequest();
        testPostRequest.setUserId(1L);
        testPostRequest.setTitle("Aventura la munte");
        testPostRequest.setCaption("O zi frumoasa la munte!");
        testPostRequest.setLocation("Bucegi, Romania");
        testPostRequest.setPictureUrl("https://example.com/post.jpg");
        testPostRequest.setStatus(PostStatus.JUST_POSTED);
        testPostRequest.setTagNames(List.of("travel"));
    }

    @Test
    void create_ShouldSetStatusAndSavePost_WhenSuccessful() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(tagRepository.findByName("travel")).thenReturn(Optional.of(testTag));
        when(postRepository.save(any(Post.class))).thenReturn(testPost);
        when(commentRepository.findByPostId(1L)).thenReturn(List.of());
        when(postVoteRepository.countByPostIdAndVoteType(1L, VoteType.LIKE)).thenReturn(0L);
        when(postVoteRepository.findByUserIdAndPostId(1L, 1L)).thenReturn(Optional.empty());

        PostResponse result = postService.create(testPostRequest);

        assertNotNull(result);
        assertEquals("Aventura la munte", result.getTitle());
        assertEquals("O zi frumoasa la munte!", result.getCaption());
        assertEquals("Bucegi, Romania", result.getLocation());
        assertEquals(PostStatus.JUST_POSTED, result.getStatus());
        assertEquals(1L, result.getUserId());
        assertEquals("andrei_m", result.getUsername());

        verify(userRepository).findById(1L);
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void create_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> postService.create(testPostRequest)
        );

        assertNotNull(exception.getMessage());
        verify(userRepository).findById(1L);
        verify(postRepository, never()).save(any(Post.class));
    }

    @Test
    void getById_ShouldReturnPost_WhenExists() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(commentRepository.findByPostId(1L)).thenReturn(List.of());
        when(postVoteRepository.countByPostIdAndVoteType(1L, VoteType.LIKE)).thenReturn(0L);

        PostResponse result = postService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Aventura la munte", result.getTitle());
        assertEquals(1L, result.getUserId());
        assertEquals("andrei_m", result.getUsername());
    }

    @Test
    void getById_ShouldThrowException_WhenNotFound() {
        when(postRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> postService.getById(99L)
        );

        assertNotNull(exception.getMessage());
    }

    @Test
    void getAll_ShouldReturnListOfPosts() {
        Iterable<Post> posts = List.of(testPost);
        when(postRepository.findAll()).thenReturn(posts);
        when(commentRepository.findByPostId(1L)).thenReturn(List.of());
        when(postVoteRepository.countByPostIdAndVoteType(1L, VoteType.LIKE)).thenReturn(0L);

        List<PostResponse> result = postService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Aventura la munte", result.get(0).getTitle());

        verify(postRepository).findAll();
    }

    @Test
    void update_ShouldUpdateAndReturnPost_WhenExists() {
        PostRequest updatedInfo = new PostRequest();
        updatedInfo.setUserId(1L);
        updatedInfo.setTitle("Titlu Nou");
        updatedInfo.setCaption("Caption Nou");
        updatedInfo.setLocation("Locatie Noua");
        updatedInfo.setPictureUrl("https://example.com/updated.jpg");
        updatedInfo.setStatus(PostStatus.FIRST_REACTIONS);
        updatedInfo.setTagNames(List.of("travel"));

        Post updatedPost = new Post();
        updatedPost.setId(1L);
        updatedPost.setTitle("Titlu Nou");
        updatedPost.setCaption("Caption Nou");
        updatedPost.setLocation("Locatie Noua");
        updatedPost.setPictureUrl("https://example.com/updated.jpg");
        updatedPost.setStatus(PostStatus.FIRST_REACTIONS);
        updatedPost.setCreatedAt(LocalDateTime.now());
        updatedPost.setUser(testUser);
        updatedPost.setTags(List.of(testTag));

        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(tagRepository.findByName("travel")).thenReturn(Optional.of(testTag));
        when(postRepository.save(any(Post.class))).thenReturn(updatedPost);
        when(commentRepository.findByPostId(1L)).thenReturn(List.of());
        when(postVoteRepository.countByPostIdAndVoteType(1L, VoteType.LIKE)).thenReturn(0L);
        when(postVoteRepository.findByUserIdAndPostId(1L, 1L)).thenReturn(Optional.empty());

        PostResponse result = postService.update(1L, updatedInfo);

        assertNotNull(result);
        assertEquals("Titlu Nou", result.getTitle());
        assertEquals("Caption Nou", result.getCaption());
        assertEquals("Locatie Noua", result.getLocation());
        assertEquals(PostStatus.FIRST_REACTIONS, result.getStatus());

        verify(postRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void delete_ShouldCallRepository() {
        postService.delete(1L);

        verify(postRepository).deleteById(1L);
    }
}