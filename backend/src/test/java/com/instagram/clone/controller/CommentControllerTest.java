package com.instagram.clone.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.model.Comment;
import com.instagram.clone.service.CommentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
@Import(SecurityConfig.class)
@AutoConfigureMockMvc
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentService commentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void create_ShouldReturnComment() throws Exception {
        Comment commentRequest = new Comment();
        // Aici am corectat din setContent în setText
        commentRequest.setText("Super poză!");

        Comment savedComment = new Comment();
        savedComment.setId(1L);
        savedComment.setText("Super poză!");

        when(commentService.create(any(Comment.class))).thenReturn(savedComment);

        mockMvc.perform(post("/comments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                // Și aici verificăm câmpul "text" din JSON
                .andExpect(jsonPath("$.text").value("Super poză!"));
    }

    @Test
    @WithMockUser
    void getById_ShouldReturnComment() throws Exception {
        Comment mockComment = new Comment();
        mockComment.setId(1L);
        mockComment.setText("Comentariu găsit!");

        when(commentService.getById(1L)).thenReturn(mockComment);

        mockMvc.perform(get("/comments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.text").value("Comentariu găsit!"));
    }
}