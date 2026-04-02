package com.instagram.clone.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.Tag;
import com.instagram.clone.model.User;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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

    private Post mockPost;

    @BeforeEach
    void setUp() {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("andrei_m");

        mockPost = new Post();
        mockPost.setId(100L);
        mockPost.setTitle("Test Title");
        mockPost.setLocation("Bucuresti");
        mockPost.setStatus(PostStatus.JUST_POSTED);
        mockPost.setUser(mockUser);
    }

    @Test
    @WithMockUser
    void createPost_ShouldReturnOk() throws Exception {
        when(postService.create(any(Post.class))).thenReturn(mockPost);

        mockMvc.perform(post("/posts")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mockPost)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100))
                .andExpect(jsonPath("$.title").value("Test Title"))
                .andExpect(jsonPath("$.status").value("JUST_POSTED"));
    }

    @Test
    @WithMockUser
    void getById_ShouldReturnPost() throws Exception {
        when(postService.getById(100L)).thenReturn(mockPost);

        mockMvc.perform(get("/posts/100")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100))
                .andExpect(jsonPath("$.title").value("Test Title"));
    }

    @Test
    @WithMockUser
    void getAll_ShouldReturnListOfPosts() throws Exception {
        when(postService.getAll()).thenReturn(List.of(mockPost));

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
        Post updatedPost = new Post();
        updatedPost.setTitle("Titlu Actualizat");

        Post savedUpdatedPost = mockPost;
        savedUpdatedPost.setTitle("Titlu Actualizat");

        when(postService.update(eq(100L), any(Post.class))).thenReturn(savedUpdatedPost);

        mockMvc.perform(put("/posts/100")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedPost)))
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