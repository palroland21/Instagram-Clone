package com.instagram.clone.controller;

import com.instagram.clone.dto.request.LoginRequest;
import com.instagram.clone.dto.request.RegisterRequest;
import com.instagram.clone.model.User;
import com.instagram.clone.service.JwtService;
import com.instagram.clone.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body("Username is required!");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required!");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password is required!");
        }

        if (request.getFullName() == null || request.getFullName().isBlank()) {
            return ResponseEntity.badRequest().body("Full name is required!");
        }

        if (!isValidPhoneNumber(request.getPhoneNumber())) {
            return ResponseEntity.badRequest().body("Phone number is invalid! Use only digits, between 10 and 15 digits.");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFullName(request.getFullName());
        user.setBio(request.getBio());
        user.setProfilePicture(request.getProfilePicture());
        user.setPhoneNumber(request.getPhoneNumber());

        User saved = userService.create(user);
        String token = jwtService.generateToken(saved.getUsername());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "userId", saved.getId(),
                "username", saved.getUsername(),
                "phoneNumber", saved.getPhoneNumber()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Username and password are required!");
        }

        try {
            User user = userService.findByUsername(request.getUsername());

            if (Boolean.TRUE.equals(user.getBanned())) {
                return ResponseEntity.status(403).body("Your account has been banned.");
            }

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(401).body("Invalid username or password!");
            }

            String token = jwtService.generateToken(user.getUsername());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "userId", user.getId(),
                    "username", user.getUsername()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body("Invalid username or password!");
        }
    }

    private boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            return false;
        }

        return phoneNumber.matches("\\d{10,15}");
    }
}