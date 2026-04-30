package utcn.ac.backendadmin.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminPostEditRequest {

    private Long adminUserId;
    private String reason;

    private String title;
    private String text;
}