package utcn.ac.backendadmin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminActionResponse {
    private String message;
    private String actionType;
    private String targetType;
    private Long targetId;
    private String reason;
    private LocalDateTime createdAt;

}