/*
package com.instagram.clone.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.dto.request.CommentRequest;
import com.instagram.clone.dto.response.CommentResponse;
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

import java.time.LocalDateTime;

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
        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setText("Super poză!");
        commentRequest.setUserId(1L);
        commentRequest.setPostId(1L);

        CommentResponse savedComment = new CommentResponse();
        savedComment.setId(1L);
        savedComment.setText("Super poză!");
        savedComment.setUserId(1L);
        savedComment.setPostId(1L);
        savedComment.setPostedAt(LocalDateTime.now());

        when(commentService.create(any(CommentRequest.class))).thenReturn(savedComment);

        mockMvc.perform(post("/comments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.text").value("Super poză!"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.postId").value(1));
    }

    @Test
    @WithMockUser
    void getById_ShouldReturnComment() throws Exception {
        CommentResponse mockComment = new CommentResponse();
        mockComment.setId(1L);
        mockComment.setText("Comentariu găsit!");
        mockComment.setUserId(1L);
        mockComment.setPostId(1L);
        mockComment.setPostedAt(LocalDateTime.now());

        when(commentService.getById(1L)).thenReturn(mockComment);

        mockMvc.perform(get("/comments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.text").value("Comentariu găsit!"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.postId").value(1));
    }
}*/
