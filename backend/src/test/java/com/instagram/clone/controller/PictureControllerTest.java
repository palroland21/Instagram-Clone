package com.instagram.clone.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.model.Picture;
import com.instagram.clone.service.PictureService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PictureController.class)
@Import(SecurityConfig.class)
@AutoConfigureMockMvc
class PictureControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PictureService pictureService;

    @Test
    @WithMockUser
    void getById_ShouldReturnPicture() throws Exception {
        Picture pic = new Picture();
        pic.setId(1L);
        pic.setPictureURL("http://aws.s3/my_photo.jpg");

        when(pictureService.getById(1L)).thenReturn(pic);

        mockMvc.perform(get("/pictures/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pictureURL").value("http://aws.s3/my_photo.jpg"));
    }
}