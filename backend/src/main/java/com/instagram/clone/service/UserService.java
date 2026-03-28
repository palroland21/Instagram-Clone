package com.instagram.clone.service;

import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.Role;
import com.instagram.clone.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User create(User user) {
        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setScore(0.0);
        return userRepository.save(user);
    }

    public User getById(Long id){
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public List<User> getAll(){
        return (List<User>) userRepository.findAll();
    }

    public User update(Long id, User updatedUser){
        User existing = getById(id);
        existing.setUsername(updatedUser.getUsername());
        existing.setEmail(updatedUser.getEmail());
        existing.setPassword(updatedUser.getPassword());
        existing.setBio(updatedUser.getBio());
        existing.setFullName(updatedUser.getFullName());
        existing.setProfilePicture(updatedUser.getProfilePicture());
        existing.setRole(updatedUser.getRole());
        existing.setScore(updatedUser.getScore());
        existing.setCreatedAt(updatedUser.getCreatedAt());
        return userRepository.save(existing);
    }

    public void delete(Long id){
        userRepository.deleteById(id);
    }
}