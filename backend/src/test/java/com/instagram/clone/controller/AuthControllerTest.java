package com.instagram.clone.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.clone.config.SecurityConfig;
import com.instagram.clone.dto.request.LoginRequest;
import com.instagram.clone.dto.request.RegisterRequest;
import com.instagram.clone.model.User;
import com.instagram.clone.service.JwtService;
import com.instagram.clone.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_ShouldReturnToken() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("andrei_m");
        request.setEmail("andrei@gmail.com");
        request.setPassword("parola123");
        request.setFullName("Andrei Mandroc");
        request.setBio("Salut!");
        request.setProfilePicture("https://example.com/profile.jpg");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("andrei_m");
        savedUser.setEmail("andrei@gmail.com");
        savedUser.setPassword("parola123");
        savedUser.setFullName("Andrei Mandroc");
        savedUser.setBio("Salut!");
        savedUser.setProfilePicture("https://example.com/profile.jpg");

        when(userService.create(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken("andrei_m")).thenReturn("mocked-jwt-token");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked-jwt-token"));
    }

    @Test
    void login_ShouldReturnToken_WhenCredentialsAreValid() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("andrei_m");
        request.setPassword("parola123");

        User user = new User();
        user.setId(1L);
        user.setUsername("andrei_m");
        user.setPassword("$2a$10$encodedPassword");

        when(userService.findByUsername("andrei_m")).thenReturn(user);
        when(passwordEncoder.matches("parola123", "$2a$10$encodedPassword")).thenReturn(true);
        when(jwtService.generateToken("andrei_m")).thenReturn("mocked-jwt-token");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked-jwt-token"));
    }

    @Test
    void login_ShouldReturnBadRequest_WhenUsernameIsMissing() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setPassword("parola123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username and password are required!"));
    }

    @Test
    void login_ShouldReturnBadRequest_WhenPasswordIsMissing() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("andrei_m");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username and password are required!"));
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenPasswordIsInvalid() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("andrei_m");
        request.setPassword("gresita");

        User user = new User();
        user.setId(1L);
        user.setUsername("andrei_m");
        user.setPassword("$2a$10$encodedPassword");

        when(userService.findByUsername("andrei_m")).thenReturn(user);
        when(passwordEncoder.matches("gresita", "$2a$10$encodedPassword")).thenReturn(false);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid username or password!"));
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenUserDoesNotExist() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("andrei_m");
        request.setPassword("parola123");

        when(userService.findByUsername("andrei_m"))
                .thenThrow(new RuntimeException("User not found"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid username or password!"));
    }
}