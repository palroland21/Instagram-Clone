package com.instagram.clone.controller;

import com.instagram.clone.dto.request.AdminCommentEditRequest;
import com.instagram.clone.dto.request.AdminPostEditRequest;
import com.instagram.clone.dto.response.AdminUserResponse;
import com.instagram.clone.service.InternalAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internal/admin")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = {"X-INTERNAL-SECRET", "Content-Type"},
        methods = {
                RequestMethod.GET,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
public class InternalAdminController {

    private final InternalAdminService internalAdminService;

    @Value("${internal.api.secret}")
    private String internalApiSecret;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers(
            @RequestHeader("X-INTERNAL-SECRET") String secret
    ) {
        validateInternalSecret(secret);
        return ResponseEntity.ok(internalAdminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/ban")
    public ResponseEntity<String> banUser(
            @PathVariable Long userId,
            @RequestHeader("X-INTERNAL-SECRET") String secret
    ) {
        validateInternalSecret(secret);
        internalAdminService.banUser(userId);
        return ResponseEntity.ok("User banned successfully.");
    }

    @PutMapping("/users/{userId}/unban")
    public ResponseEntity<String> unbanUser(
            @PathVariable Long userId,
            @RequestHeader("X-INTERNAL-SECRET") String secret
    ) {
        validateInternalSecret(secret);
        internalAdminService.unbanUser(userId);
        return ResponseEntity.ok("User unbanned successfully.");
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long postId,
            @RequestHeader("X-INTERNAL-SECRET") String secret
    ) {
        validateInternalSecret(secret);
        internalAdminService.deletePost(postId);
        return ResponseEntity.ok("Post deleted successfully.");
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader("X-INTERNAL-SECRET") String secret
    ) {
        validateInternalSecret(secret);
        internalAdminService.deleteComment(commentId);
        return ResponseEntity.ok("Comment deleted successfully.");
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<String> editPost(
            @PathVariable Long postId,
            @RequestHeader("X-INTERNAL-SECRET") String secret,
            @RequestBody AdminPostEditRequest request
    ) {
        validateInternalSecret(secret);
        internalAdminService.editPost(postId, request);
        return ResponseEntity.ok("Post edited successfully.");
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<String> editComment(
            @PathVariable Long commentId,
            @RequestHeader("X-INTERNAL-SECRET") String secret,
            @RequestBody AdminCommentEditRequest request
    ) {
        validateInternalSecret(secret);
        internalAdminService.editComment(commentId, request);
        return ResponseEntity.ok("Comment edited successfully.");
    }

    private void validateInternalSecret(String secret) {
        if (!internalApiSecret.equals(secret)) {
            throw new RuntimeException("Invalid internal secret.");
        }
    }
}