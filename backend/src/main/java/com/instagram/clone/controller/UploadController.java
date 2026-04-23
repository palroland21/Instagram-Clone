package com.instagram.clone.controller;

import com.instagram.clone.dto.response.UploadResponse;
import com.instagram.clone.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(cloudinaryService.uploadImage(file));
    }
}