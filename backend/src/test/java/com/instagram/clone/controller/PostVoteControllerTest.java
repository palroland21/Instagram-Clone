package com.instagram.clone.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.PostVote;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.VoteType;
import com.instagram.clone.service.PostVoteService;
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

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void create_ShouldReturnOk() throws Exception {
        User user = new User();
        user.setId(1L);

        Post post = new Post();
        post.setId(10L);

        PostVote voteRequest = new PostVote();
        voteRequest.setUser(user);
        voteRequest.setPost(post);
        voteRequest.setVoteType(VoteType.LIKE);

        PostVote savedVote = new PostVote();
        savedVote.setId(500L);
        savedVote.setVoteType(VoteType.LIKE);

        when(postVoteService.create(any(PostVote.class))).thenReturn(savedVote);

        mockMvc.perform(post("/post-votes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(voteRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(500))
                .andExpect(jsonPath("$.voteType").value("LIKE"));
    }
}