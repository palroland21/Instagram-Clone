package com.instagram.clone.service;

import com.instagram.clone.dto.request.PictureRequest;
import com.instagram.clone.dto.response.PictureResponse;
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
        Post mockPost = new Post();
        mockPost.setId(1L);

        PictureRequest pictureRequest = new PictureRequest();
        pictureRequest.setUrl("https://cdn.instagram.com/p123.jpg");
        pictureRequest.setPostId(1L);

        Picture savedPicture = new Picture();
        savedPicture.setId(1L);
        savedPicture.setPictureURL("https://cdn.instagram.com/p123.jpg");
        savedPicture.setPost(mockPost);

        when(postRepository.findById(1L)).thenReturn(Optional.of(mockPost));
        when(pictureRepository.save(any(Picture.class))).thenReturn(savedPicture);

        PictureResponse result = pictureService.create(pictureRequest);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("https://cdn.instagram.com/p123.jpg", result.getUrl());
        assertEquals(1L, result.getPostId());
    }
}