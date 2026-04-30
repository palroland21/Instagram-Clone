package com.instagram.clone.service;

import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.Role;
import com.instagram.clone.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
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

        if (!isValidPhoneNumber(updatedUser.getPhoneNumber())) {
            throw new RuntimeException("Phone number is invalid! Use only digits, between 10 and 15 digits.");
        }

        existing.setUsername(updatedUser.getUsername());
        existing.setEmail(updatedUser.getEmail());
        existing.setBio(updatedUser.getBio());
        existing.setFullName(updatedUser.getFullName());
        existing.setProfilePicture(updatedUser.getProfilePicture());
        existing.setPhoneNumber(updatedUser.getPhoneNumber());

        return userRepository.save(existing);
    }

    private boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            return false;
        }

        return phoneNumber.matches("\\d{10,15}");
    }

    public void delete(Long id){
        userRepository.deleteById(id);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public List<User> getFollowers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowers();
    }

    public List<User> getFollowing(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowing();
    }

    @Transactional
    public void followUser(Long followerId, Long followedId) {
        if (followerId.equals(followedId)) {
            throw new RuntimeException("You cannot follow yourself");
        }
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));

        if (!followed.getFollowers().contains(follower)) {
            followed.getFollowers().add(follower);
            userRepository.save(followed);
        }
    }

    @Transactional
    public void unfollowUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));

        if (followed.getFollowers().contains(follower)) {
            followed.getFollowers().remove(follower);
            userRepository.save(followed);
        }
    }





}