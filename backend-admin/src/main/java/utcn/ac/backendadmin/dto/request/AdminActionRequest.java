package utcn.ac.backendadmin.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminActionRequest {
    private Long adminUserId;
    private String reason;
}