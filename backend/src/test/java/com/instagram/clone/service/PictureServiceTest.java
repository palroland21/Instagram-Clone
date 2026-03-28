package com.instagram.clone.service;

import com.instagram.clone.model.Picture;
import com.instagram.clone.model.Post;
import com.instagram.clone.repository.PictureRepository;
import com.instagram.clone.repository.PostRepository;
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
class PictureServiceTest {

    @Mock
    private PictureRepository pictureRepository;

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PictureService pictureService;

    @Test
    void create_ShouldReturnSavedPicture() {
        // GIVEN
        Post mockPost = new Post();
        mockPost.setId(1L);

        Picture picture = new Picture();
        picture.setPictureURL("https://cdn.instagram.com/p123.jpg");
        picture.setPost(mockPost);

        // Simulăm găsirea postării și salvarea pozei
        when(postRepository.findById(1L)).thenReturn(Optional.of(mockPost));
        when(pictureRepository.save(any(Picture.class))).thenReturn(picture);

        // WHEN
        Picture saved = pictureService.create(picture);

        // THEN
        assertNotNull(saved);
        assertEquals("https://cdn.instagram.com/p123.jpg", saved.getPictureURL());
        assertEquals(1L, saved.getPost().getId());
    }
}