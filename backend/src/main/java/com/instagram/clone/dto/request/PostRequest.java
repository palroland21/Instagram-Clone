package com.instagram.clone.dto.request;

import com.instagram.clone.model.enums.PostStatus;
import lombok.Data;

import java.util.List;

@Data
public class PostRequest {
    private Long userId;
    private List<String> pictureUrls;
    private String location;
    private String caption;
    private String title;
    private PostStatus status;
    private List<String> tagNames;
}