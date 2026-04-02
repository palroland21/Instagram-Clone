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
        when(tagRepository.findById(1L)).thenReturn(Optional.of(testTag));
        when(postRepository.save(any(Post.class))).thenAnswer(invocation -> invocation.getArgument(0));


        Post result = postService.create(testPost);

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
        when(tagRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postService.create(testPost);
        });

        assertTrue(exception.getMessage().contains("Tag not found"));
        verify(postRepository, never()).save(any(Post.class));
    }

    @Test
    void getById_ShouldReturnPost_WhenExists() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        Post result = postService.getById(1L);

        assertNotNull(result);
        assertEquals("Aventura la munte", result.getTitle());
    }

    @Test
    void getById_ShouldThrowException_WhenNotFound() {
        when(postRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> postService.getById(99L));
    }

    @Test
    void getAll_ShouldReturnListOfPosts() {
        when(postRepository.findAll()).thenReturn(List.of(testPost));

        List<Post> result = postService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Aventura la munte", result.get(0).getTitle());
        verify(postRepository, times(1)).findAll();
    }

    @Test
    void update_ShouldUpdateAndReturnPost_WhenExists() {
        Post updatedInfo = new Post();
        updatedInfo.setTitle("Titlu Nou");
        updatedInfo.setCaption("Caption Nou");
        updatedInfo.setLocation("Locatie Noua");

        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(postRepository.save(any(Post.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Post result = postService.update(1L, updatedInfo);

        assertNotNull(result);
        assertEquals("Titlu Nou", result.getTitle());
        assertEquals("Caption Nou", result.getCaption());
        assertEquals("Locatie Noua", result.getLocation());

        verify(postRepository, times(1)).findById(1L);
        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void delete_ShouldCallRepository() {
        postService.delete(1L);

        verify(postRepository, times(1)).deleteById(1L);
    }
}