package com.instagram.clone.service;

import com.instagram.clone.model.User;
import com.instagram.clone.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void create_ShouldEncodePasswordAndSaveUser() {
        User user = new User();
        user.setUsername("andrei_m");
        user.setEmail("andrei@gmail.com");
        user.setPassword("parola123");

        when(passwordEncoder.encode("parola123")).thenReturn("encodedPassword123");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("andrei_m");
        savedUser.setEmail("andrei@gmail.com");
        savedUser.setPassword("encodedPassword123");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.create(user);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("andrei_m", result.getUsername());
        assertEquals("encodedPassword123", result.getPassword());

        verify(passwordEncoder).encode("parola123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void findByUsername_ShouldReturnUser_WhenExists() {
        User user = new User();
        user.setId(1L);
        user.setUsername("andrei_m");

        when(userRepository.findByUsername("andrei_m")).thenReturn(Optional.of(user));

        User result = userService.findByUsername("andrei_m");

        assertNotNull(result);
        assertEquals("andrei_m", result.getUsername());
        verify(userRepository).findByUsername("andrei_m");
    }

    @Test
    void findByUsername_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findByUsername("andrei_m")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.findByUsername("andrei_m")
        );

        assertEquals("User not found: andrei_m", exception.getMessage());
        verify(userRepository).findByUsername("andrei_m");
    }
}