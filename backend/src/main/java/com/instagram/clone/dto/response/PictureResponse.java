package com.instagram.clone.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PictureResponse {
    private Long id;
    private String url;
    private Long postId;
}
