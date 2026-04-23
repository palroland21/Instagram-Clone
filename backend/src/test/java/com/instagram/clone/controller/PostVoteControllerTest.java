/*
package com.instagram.clone.controller;

import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.service.PostVoteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostVoteController.class)
@Import(SecurityConfig.class)
@AutoConfigureMockMvc
class PostVoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostVoteService postVoteService;

    @Test
    @WithMockUser
    void toggleLike_ShouldReturnOk() throws Exception {
        Map<String, Object> response = new HashMap<>();
        response.put("liked", true);
        response.put("likeCount", 1L);

        when(postVoteService.toggleLike(1L, 10L)).thenReturn(response);

        mockMvc.perform(post("/post-votes/toggle-like")
                        .with(csrf())
                        .param("userId", "1")
                        .param("postId", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.liked").value(true))
                .andExpect(jsonPath("$.likeCount").value(1));
    }

    @Test
    @WithMockUser
    void getLikeCount_ShouldReturnOk() throws Exception {
        when(postVoteService.getLikeCount(10L)).thenReturn(5L);

        mockMvc.perform(get("/post-votes/count/10"))
                .andExpect(status().isOk())
                .andExpect(content().string("5"));
    }

    @Test
    @WithMockUser
    void isLikedByUser_ShouldReturnOk() throws Exception {
        when(postVoteService.isLikedByUser(1L, 10L)).thenReturn(true);

        mockMvc.perform(get("/post-votes/liked")
                        .param("userId", "1")
                        .param("postId", "10"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }
}*/
