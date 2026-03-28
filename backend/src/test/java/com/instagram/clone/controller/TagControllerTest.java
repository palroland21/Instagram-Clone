package com.instagram.clone.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.model.Tag;
import com.instagram.clone.service.TagService;
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

@WebMvcTest(TagController.class)
@Import(SecurityConfig.class)
@AutoConfigureMockMvc
class TagControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private TagService tagService;
    @Autowired private ObjectMapper objectMapper;

    @Test
    @WithMockUser
    void create_ShouldReturnTag() throws Exception {
        Tag tag = new Tag();
        tag.setName("#nature");

        when(tagService.create(any(Tag.class))).thenReturn(tag);

        mockMvc.perform(post("/tags").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tag)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("#nature"));
    }
}