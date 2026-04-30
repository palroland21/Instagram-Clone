package com.instagram.clone.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminCommentEditRequest {

    private Long adminUserId;
    private String reason;

    private String text;
}