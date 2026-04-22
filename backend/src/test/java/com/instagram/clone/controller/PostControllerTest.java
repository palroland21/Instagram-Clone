package com.instagram.clone.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.dto.request.PostRequest;
import com.instagram.clone.dto.response.PostResponse;
import com.instagram.clone.model.enums.PostStatus;
import com.instagram.clone.service.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
@Import(SecurityConfig.class)
@AutoConfigureMockMvc
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @Autowired
    private ObjectMapper objectMapper;

    private PostResponse mockPostResponse;
    private PostRequest mockPostRequest;

    @BeforeEach
    void setUp() {
        mockPostRequest = new PostRequest();
        mockPostRequest.setUserId(1L);
        mockPostRequest.setTitle("Test Title");
        mockPostRequest.setCaption("Test caption");
        mockPostRequest.setLocation("Bucuresti");
        mockPostRequest.setPictureUrl("https://example.com/post.jpg");
        mockPostRequest.setStatus(PostStatus.JUST_POSTED);

        mockPostResponse = new PostResponse();
        mockPostResponse.setId(100L);
        mockPostResponse.setUserId(1L);
        mockPostResponse.setUsername("andrei_m");
        mockPostResponse.setTitle("Test Title");
        mockPostResponse.setCaption("Test caption");
        mockPostResponse.setLocation("Bucuresti");
        mockPostResponse.setPictureUrl("https://example.com/post.jpg");
        mockPostResponse.setStatus(PostStatus.JUST_POSTED);
        mockPostResponse.setCreatedAt(LocalDateTime.now());
        mockPostResponse.setTagIds(List.of(1L));
        mockPostResponse.setTagNames(List.of("natura"));
    }

    @Test
    @WithMockUser
    void createPost_ShouldReturnOk() throws Exception {
        when(postService.create(any(PostRequest.class))).thenReturn(mockPostResponse);

        mockMvc.perform(post("/posts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockPostRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100))
                .andExpect(jsonPath("$.title").value("Test Title"))
                .andExpect(jsonPath("$.status").value("JUST_POSTED"));
    }

    @Test
    @WithMockUser
    void getById_ShouldReturnPost() throws Exception {
        when(postService.getById(100L)).thenReturn(mockPostResponse);

        mockMvc.perform(get("/posts/100")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100))
                .andExpect(jsonPath("$.title").value("Test Title"));
    }

    @Test
    @WithMockUser
    void getAll_ShouldReturnListOfPosts() throws Exception {
        when(postService.getAll()).thenReturn(List.of(mockPostResponse));

        mockMvc.perform(get("/posts")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(100))
                .andExpect(jsonPath("$[0].title").value("Test Title"))
                .andExpect(jsonPath("$.size()").value(1));
    }

    @Test
    @WithMockUser
    void update_ShouldReturnUpdatedPost() throws Exception {
        PostRequest updatedPostRequest = new PostRequest();
        updatedPostRequest.setUserId(1L);
        updatedPostRequest.setTitle("Titlu Actualizat");
        updatedPostRequest.setCaption("Caption actualizat");
        updatedPostRequest.setLocation("Cluj");
        updatedPostRequest.setPictureUrl("https://example.com/updated.jpg");
        updatedPostRequest.setStatus(PostStatus.FIRST_REACTIONS);

        PostResponse updatedResponse = new PostResponse();
        updatedResponse.setId(100L);
        updatedResponse.setUserId(1L);
        updatedResponse.setUsername("andrei_m");
        updatedResponse.setTitle("Titlu Actualizat");
        updatedResponse.setCaption("Caption actualizat");
        updatedResponse.setLocation("Cluj");
        updatedResponse.setPictureUrl("https://example.com/updated.jpg");
        updatedResponse.setStatus(PostStatus.FIRST_REACTIONS);
        updatedResponse.setCreatedAt(LocalDateTime.now());
        updatedResponse.setTagIds(List.of(1L));
        updatedResponse.setTagNames(List.of("natura"));

        when(postService.update(eq(100L), any(PostRequest.class))).thenReturn(updatedResponse);

        mockMvc.perform(put("/posts/100")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedPostRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100))
                .andExpect(jsonPath("$.title").value("Titlu Actualizat"));
    }

    @Test
    @WithMockUser
    void delete_ShouldReturnSuccessMessage() throws Exception {
        mockMvc.perform(delete("/posts/100")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Post deleted successfully"));

        verify(postService).delete(100L);
    }
}