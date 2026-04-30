package utcn.ac.backendadmin.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_action_logs")
@Data
public class AdminActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long adminUserId;

    private String actionType;

    private String targetType;

    private Long targetId;

    @Column(length = 1000)
    private String reason;

    private LocalDateTime createdAt;

    public AdminActionLog() {
    }

    public AdminActionLog(Long adminUserId, String actionType, String targetType, Long targetId, String reason) {
        this.adminUserId = adminUserId;
        this.actionType = actionType;
        this.targetType = targetType;
        this.targetId = targetId;
        this.reason = reason;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}