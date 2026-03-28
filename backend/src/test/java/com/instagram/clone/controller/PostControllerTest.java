package com.instagram.clone.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.Tag;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.PostStatus;
import com.instagram.clone.service.PostService;
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
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    @Test
    @WithMockUser // Simulează un utilizator logat
    void createPost_ShouldReturnOk() throws Exception {
        // 1. GIVEN - Pregătim obiectele complexe
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("andrei_m");

        Tag mockTag = new Tag();
        mockTag.setName("java_programming");

        Post postRequest = new Post();
        postRequest.setTitle("Primul meu test complex");
        postRequest.setLocation("Bucuresti");
        postRequest.setUser(mockUser);
        postRequest.setTags(List.of(mockTag));

        // Simulăm ce returnează Service-ul după "salvare"
        Post savedPost = postRequest;
        savedPost.setId(100L);
        savedPost.setStatus(PostStatus.JUST_POSTED);

        when(postService.create(any(Post.class))).thenReturn(savedPost);

        // 2. WHEN & THEN - Trimitem cererea și verificăm răspunsul
        mockMvc.perform(post("/posts")
                        .with(csrf()) // "Ștampila" obligatorie
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(100))
                .andExpect(jsonPath("$.title").value("Primul meu test complex"))
                .andExpect(jsonPath("$.status").value("JUST_POSTED"))
                .andExpect(jsonPath("$.user.username").value("andrei_m"));
    }
}