package com.instagram.clone.controller;


import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.model.User;
import com.instagram.clone.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import org.springframework.security.test.context.support.WithMockUser;


@WebMvcTest(UserController.class) // Testăm doar stratul de Web pentru UserController
@Import(SecurityConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc; // Instrumentul care "bate la ușa" API-ului

    @MockBean
    private UserService userService; // Creăm o dublură pentru Service

    @Autowired
    private ObjectMapper objectMapper; // Transformă obiectele Java în JSON și invers

    @Test
    @WithMockUser
    void createUser_ShouldReturnCreatedStatus() throws Exception {
        // GIVEN - Datele tale din Testare.txt
        User userRequest = new User();
        userRequest.setUsername("ion_popescu");
        userRequest.setEmail("ion.popescu@email.com");
        userRequest.setPassword("parola123");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("ion_popescu");

        // Spunem Service-ului să returneze user-ul salvat când e apelat de Controller
        when(userService.create(any(User.class))).thenReturn(savedUser);

        // WHEN & THEN - Simulăm POST http://localhost:9090/users
        mockMvc.perform(post("/users")
                        .with(csrf()) // Aceasta este "insigna" care îi permite accesul
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userRequest)))
                .andExpect(status().isOk());
    }
}