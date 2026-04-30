package utcn.ac.backendadmin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utcn.ac.backendadmin.dto.request.AdminActionRequest;
import utcn.ac.backendadmin.dto.request.AdminCommentEditRequest;
import utcn.ac.backendadmin.dto.request.AdminPostEditRequest;
import utcn.ac.backendadmin.dto.response.AdminActionResponse;
import utcn.ac.backendadmin.model.AdminActionLog;
import utcn.ac.backendadmin.service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<String> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PutMapping("/users/{userId}/ban")
    public ResponseEntity<AdminActionResponse> banUser(
            @PathVariable Long userId,
            @RequestBody AdminActionRequest request
    ) {
        return ResponseEntity.ok(adminService.banUser(userId, request));
    }

    @PutMapping("/users/{userId}/unban")
    public ResponseEntity<AdminActionResponse> unbanUser(
            @PathVariable Long userId,
            @RequestBody AdminActionRequest request
    ) {
        return ResponseEntity.ok(adminService.unbanUser(userId, request));
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<AdminActionResponse> deletePost(
            @PathVariable Long postId,
            @RequestBody AdminActionRequest request
    ) {
        return ResponseEntity.ok(adminService.deletePost(postId, request));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<AdminActionResponse> deleteComment(
            @PathVariable Long commentId,
            @RequestBody AdminActionRequest request
    ) {
        return ResponseEntity.ok(adminService.deleteComment(commentId, request));
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<AdminActionResponse> editPost(
            @PathVariable Long postId,
            @RequestBody AdminPostEditRequest request
    ) {
        return ResponseEntity.ok(adminService.editPost(postId, request));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<AdminActionResponse> editComment(
            @PathVariable Long commentId,
            @RequestBody AdminCommentEditRequest request
    ) {
        return ResponseEntity.ok(adminService.editComment(commentId, request));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AdminActionLog>> getLogs() {
        return ResponseEntity.ok(adminService.getLogs());
    }
}