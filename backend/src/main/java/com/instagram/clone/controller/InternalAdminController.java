package com.instagram.clone.controller;

import com.instagram.clone.dto.request.AdminCommentEditRequest;
import com.instagram.clone.dto.request.AdminPostEditRequest;
import com.instagram.clone.dto.response.AdminUserResponse;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.Role;
import com.instagram.clone.service.InternalAdminService;
import com.instagram.clone.service.JwtService;
import com.instagram.clone.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/internal/admin")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = {"Authorization", "X-INTERNAL-SECRET", "Content-Type"},
        methods = {
                RequestMethod.GET,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
public class InternalAdminController {

    private final InternalAdminService internalAdminService;
    private final JwtService jwtService;
    private final UserService userService;

    @Value("${internal.api.secret}")
    private String internalApiSecret;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers(
            @RequestHeader(value = "X-INTERNAL-SECRET", required = false) String secret,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        validateInternalAdminAccess(secret, authorizationHeader);
        return ResponseEntity.ok(internalAdminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/ban")
    public ResponseEntity<String> banUser(
            @PathVariable Long userId,
            @RequestHeader(value = "X-INTERNAL-SECRET", required = false) String secret,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        validateInternalAdminAccess(secret, authorizationHeader);
        internalAdminService.banUser(userId);
        return ResponseEntity.ok("User banned successfully.");
    }

    @PutMapping("/users/{userId}/unban")
    public ResponseEntity<String> unbanUser(
            @PathVariable Long userId,
            @RequestHeader(value = "X-INTERNAL-SECRET", required = false) String secret,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        validateInternalAdminAccess(secret, authorizationHeader);
        internalAdminService.unbanUser(userId);
        return ResponseEntity.ok("User unbanned successfully.");
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long postId,
            @RequestHeader(value = "X-INTERNAL-SECRET", required = false) String secret,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        validateInternalAdminAccess(secret, authorizationHeader);
        internalAdminService.deletePost(postId);
        return ResponseEntity.ok("Post deleted successfully.");
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader(value = "X-INTERNAL-SECRET", required = false) String secret,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        validateInternalAdminAccess(secret, authorizationHeader);
        internalAdminService.deleteComment(commentId);
        return ResponseEntity.ok("Comment deleted successfully.");
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<String> editPost(
            @PathVariable Long postId,
            @RequestHeader(value = "X-INTERNAL-SECRET", required = false) String secret,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestBody AdminPostEditRequest request
    ) {
        validateInternalAdminAccess(secret, authorizationHeader);
        internalAdminService.editPost(postId, request);
        return ResponseEntity.ok("Post edited successfully.");
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<String> editComment(
            @PathVariable Long commentId,
            @RequestHeader(value = "X-INTERNAL-SECRET", required = false) String secret,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestBody AdminCommentEditRequest request
    ) {
        validateInternalAdminAccess(secret, authorizationHeader);
        internalAdminService.editComment(commentId, request);
        return ResponseEntity.ok("Comment edited successfully.");
    }

    private void validateInternalAdminAccess(String secret, String authorizationHeader) {
        validateInternalSecret(secret);

        User user = getUserFromAuthorizationHeader(authorizationHeader);

        if (!Role.ADMIN.equals(user.getRole())) {
            throwForbidden();
        }
    }

    private void validateInternalSecret(String secret) {
        if (secret == null || !internalApiSecret.equals(secret)) {
            throwForbidden();
        }
    }

    private User getUserFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throwForbidden();
        }

        try {
            String token = authorizationHeader.substring("Bearer ".length());
            String username = jwtService.extractUsername(token);
            return userService.findByUsername(username);
        } catch (Exception e) {
            throwForbidden();
            return null;
        }
    }

    private void throwForbidden() {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You are not authorized to access this page."
        );
    }
}
