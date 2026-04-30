package com.instagram.clone.controller;

import com.instagram.clone.dto.request.UserRequest;
import com.instagram.clone.dto.response.UserResponse;
import com.instagram.clone.model.User;
import com.instagram.clone.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> getAll() {
        return userService.getAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable Long id) {
        return toResponse(userService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody UserRequest request) {
        try {
            User updatedUser = new User();

            updatedUser.setUsername(request.getUsername());
            updatedUser.setEmail(request.getEmail());
            updatedUser.setFullName(request.getFullName());
            updatedUser.setBio(request.getBio());
            updatedUser.setProfilePicture(request.getProfilePicture());
            updatedUser.setPhoneNumber(request.getPhoneNumber());

            return ResponseEntity.ok(toResponse(userService.update(id, updatedUser)));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<List<UserResponse>> getFollowers(@PathVariable Long id) {
        List<User> followers = userService.getFollowers(id);

        List<UserResponse> response = followers.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<List<UserResponse>> getFollowing(@PathVariable Long id) {
        List<User> following = userService.getFollowing(id);

        List<UserResponse> response = following.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/following/{targetId}")
    public ResponseEntity<String> followUser(@PathVariable Long id, @PathVariable Long targetId) {
        try {
            userService.followUser(id, targetId);
            return ResponseEntity.ok("Followed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/following/{targetId}")
    public ResponseEntity<String> unfollowUser(@PathVariable Long id, @PathVariable Long targetId) {
        try {
            userService.unfollowUser(id, targetId);
            return ResponseEntity.ok("Unfollowed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        userService.delete(id);
        return "User deleted successfully";
    }

    private UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setBio(user.getBio());
        response.setProfilePicture(user.getProfilePicture());
        response.setCreatedAt(user.getCreatedAt());

        return response;
    }
}