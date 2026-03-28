package com.instagram.clone.service;

import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.Role;
import com.instagram.clone.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("ion_popescu");
        testUser.setEmail("ion.popescu@email.com");
        testUser.setFullName("Ion Popescu");
        testUser.setBio("Pasionat de fotografie");
    }

    @Test
    void create_ShouldInitializeUserAndSave() {
        // GIVEN
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        User result = userService.create(testUser);

        // THEN
        assertNotNull(result);
        assertEquals(Role.USER, result.getRole()); // Verificam logica din UserService
        assertEquals(0.0, result.getScore());     // Verificam initializarea scorului
        assertNotNull(result.getCreatedAt());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void getById_ShouldReturnUser_WhenExists() {
        // GIVEN
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // WHEN
        User result = userService.getById(1L);

        // THEN
        assertNotNull(result);
        assertEquals("ion_popescu", result.getUsername());
        verify(userRepository).findById(1L);
    }

    @Test
    void getById_ShouldThrowException_WhenNotFound() {
        // GIVEN
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // WHEN & THEN
        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.getById(99L));
        assertTrue(exception.getMessage().contains("User not found"));
    }

    @Test
    void getAll_ShouldReturnListOfUsers() {
        // GIVEN
        when(userRepository.findAll()).thenReturn(List.of(testUser));

        // WHEN
        List<User> result = userService.getAll();

        // THEN
        assertEquals(1, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void update_ShouldModifyExistingUser() {
        // GIVEN
        User updatedInfo = new User();
        updatedInfo.setUsername("ion_nou");
        updatedInfo.setBio("Bio nou");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        // WHEN
        User result = userService.update(1L, updatedInfo);

        // THEN
        assertEquals("ion_nou", result.getUsername());
        assertEquals("Bio nou", result.getBio());
        verify(userRepository).save(testUser);
    }

    @Test
    void delete_ShouldCallRepository() {
        // WHEN
        userService.delete(1L);

        // THEN
        verify(userRepository, times(1)).deleteById(1L);
    }
}