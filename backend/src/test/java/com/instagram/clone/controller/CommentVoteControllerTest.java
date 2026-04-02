package com.instagram.clone.controller;

import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.service.CommentVoteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CommentVoteController.class)
@Import(SecurityConfig.class)
@AutoConfigureMockMvc
class CommentVoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentVoteService commentVoteService;

    @Test
    @WithMockUser
    void delete_ShouldReturnSuccessMessage() throws Exception {
        mockMvc.perform(delete("/comment-votes/1")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("CommentVote deleted successfully"));
    }
}