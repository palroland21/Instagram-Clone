package utcn.ac.backendadmin.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import utcn.ac.backendadmin.dto.request.AdminActionRequest;
import utcn.ac.backendadmin.dto.request.AdminCommentEditRequest;
import utcn.ac.backendadmin.dto.request.AdminPostEditRequest;
import utcn.ac.backendadmin.dto.response.AdminActionResponse;
import utcn.ac.backendadmin.model.AdminActionLog;
import utcn.ac.backendadmin.repository.AdminActionLogRepository;

import java.util.List;

@Service
public class AdminService {

    private final RestTemplate restTemplate;
    private final AdminActionLogRepository adminActionLogRepository;

    @Value("${main.backend.url}")
    private String mainBackendUrl;

    @Value("${internal.api.secret}")
    private String internalApiSecret;

    public AdminService(RestTemplate restTemplate, AdminActionLogRepository adminActionLogRepository) {
        this.restTemplate = restTemplate;
        this.adminActionLogRepository = adminActionLogRepository;
    }

    public ResponseEntity<String> getAllUsers() {
        HttpEntity<Void> entity = new HttpEntity<>(createInternalHeaders());

        return restTemplate.exchange(
                mainBackendUrl + "/internal/admin/users",
                HttpMethod.GET,
                entity,
                String.class
        );
    }

    public AdminActionResponse banUser(Long userId, AdminActionRequest request) {
        callMainBackend(
                mainBackendUrl + "/internal/admin/users/" + userId + "/ban",
                HttpMethod.PUT,
                request
        );

        AdminActionLog log = saveLog(request.getAdminUserId(), "BAN_USER", "USER", userId, request.getReason());

        return toResponse("User banned successfully.", log);
    }

    public AdminActionResponse unbanUser(Long userId, AdminActionRequest request) {
        callMainBackend(
                mainBackendUrl + "/internal/admin/users/" + userId + "/unban",
                HttpMethod.PUT,
                request
        );

        AdminActionLog log = saveLog(request.getAdminUserId(), "UNBAN_USER", "USER", userId, request.getReason());

        return toResponse("User unbanned successfully.", log);
    }

    public AdminActionResponse deletePost(Long postId, AdminActionRequest request) {
        callMainBackend(
                mainBackendUrl + "/internal/admin/posts/" + postId,
                HttpMethod.DELETE,
                request
        );

        AdminActionLog log = saveLog(request.getAdminUserId(), "DELETE_POST", "POST", postId, request.getReason());

        return toResponse("Post deleted successfully.", log);
    }

    public AdminActionResponse deleteComment(Long commentId, AdminActionRequest request) {
        callMainBackend(
                mainBackendUrl + "/internal/admin/comments/" + commentId,
                HttpMethod.DELETE,
                request
        );

        AdminActionLog log = saveLog(request.getAdminUserId(), "DELETE_COMMENT", "COMMENT", commentId, request.getReason());

        return toResponse("Comment deleted successfully.", log);
    }

    public AdminActionResponse editPost(Long postId, AdminPostEditRequest request) {
        callMainBackend(
                mainBackendUrl + "/internal/admin/posts/" + postId,
                HttpMethod.PUT,
                request
        );

        AdminActionLog log = saveLog(request.getAdminUserId(), "EDIT_POST", "POST", postId, request.getReason());

        return toResponse("Post edited successfully.", log);
    }

    public AdminActionResponse editComment(Long commentId, AdminCommentEditRequest request) {
        callMainBackend(
                mainBackendUrl + "/internal/admin/comments/" + commentId,
                HttpMethod.PUT,
                request
        );

        AdminActionLog log = saveLog(request.getAdminUserId(), "EDIT_COMMENT", "COMMENT", commentId, request.getReason());

        return toResponse("Comment edited successfully.", log);
    }

    public List<AdminActionLog> getLogs() {
        return adminActionLogRepository.findAll();
    }

    private void callMainBackend(String url, HttpMethod method, Object request) {
        HttpEntity<Object> entity = new HttpEntity<>(request, createInternalHeaders());

        restTemplate.exchange(
                url,
                method,
                entity,
                String.class
        );
    }

    private HttpHeaders createInternalHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-INTERNAL-SECRET", internalApiSecret);
        return headers;
    }

    private AdminActionLog saveLog(Long adminUserId, String actionType, String targetType, Long targetId, String reason) {
        AdminActionLog log = new AdminActionLog(
                adminUserId,
                actionType,
                targetType,
                targetId,
                reason
        );

        return adminActionLogRepository.save(log);
    }

    private AdminActionResponse toResponse(String message, AdminActionLog log) {
        return new AdminActionResponse(
                message,
                log.getActionType(),
                log.getTargetType(),
                log.getTargetId(),
                log.getReason(),
                log.getCreatedAt()
        );
    }
}