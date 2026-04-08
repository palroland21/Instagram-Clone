package com.instagram.clone.controller;

import com.instagram.clone.dto.LoginRequest;
import com.instagram.clone.dto.RegisterRequest;
import com.instagram.clone.service.JwtService;
import com.instagram.clone.model.User;
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
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFullName(request.getFullName());
        user.setBio(request.getBio());
        user.setProfilePicture(request.getProfilePicture());

        User saved = userService.create(user);
        String token = jwtService.generateToken(saved.getUsername());

        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Username and password are required!");
        }

        try {
            User user = userService.findByUsername(request.getUsername());

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(401).body("Invalid username or password!");
            }

            String token = jwtService.generateToken(user.getUsername());

            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body("Invalid username or password!");
        }
    }
}