package com.instagram.clone.service;

import com.instagram.clone.model.Post;
import com.instagram.clone.model.Tag;
import com.instagram.clone.model.enums.PostStatus;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.TagRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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

    @InjectMocks
    private PostService postService;

    private Post testPost;
    private Tag testTag;

    @BeforeEach
    void setUp() {
        testTag = new Tag();
        testTag.setId(1L);
        testTag.setName("natura");

        testPost = new Post();
        testPost.setId(1L);
        testPost.setTitle("Aventura la munte");
        testPost.setCaption("O zi frumoasa la munte!");
        testPost.setLocation("Bucegi, Romania");
        testPost.setTags(List.of(testTag));
    }

    @Test
    void create_ShouldSetStatusAndMapTags_WhenSuccessful() {
        // GIVEN
        when(tagRepository.findById(1L)).thenReturn(Optional.of(testTag));
        when(postRepository.save(any(Post.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        Post result = postService.create(testPost);

        // THEN
        assertNotNull(result);
        assertEquals(PostStatus.JUST_POSTED, result.getStatus());
        assertNotNull(result.getCreatedAt());
        assertEquals(1, result.getTags().size());
        assertEquals("natura", result.getTags().get(0).getName());

        verify(tagRepository, times(1)).findById(1L);
        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void create_ShouldThrowException_WhenTagNotFound() {
        // GIVEN
        when(tagRepository.findById(1L)).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postService.create(testPost);
        });

        assertTrue(exception.getMessage().contains("Tag not found"));
        verify(postRepository, never()).save(any(Post.class));
    }

    @Test
    void getById_ShouldReturnPost_WhenExists() {
        // GIVEN
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        // WHEN
        Post result = postService.getById(1L);

        // THEN
        assertNotNull(result);
        assertEquals("Aventura la munte", result.getTitle());
    }

    @Test
    void getById_ShouldThrowException_WhenNotFound() {
        // GIVEN
        when(postRepository.findById(99L)).thenReturn(Optional.empty());

        // WHEN & THEN
        assertThrows(RuntimeException.class, () -> postService.getById(99L));
    }

    @Test
    void delete_ShouldCallRepository() {
        // WHEN
        postService.delete(1L);

        // THEN
        verify(postRepository, times(1)).deleteById(1L);
    }
}