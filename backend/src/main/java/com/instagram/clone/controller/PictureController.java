package com.instagram.clone.controller;

import com.instagram.clone.dto.request.PictureRequest;
import com.instagram.clone.dto.response.PictureResponse;
import com.instagram.clone.service.PictureService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pictures")
public class PictureController {

    private final PictureService pictureService;

    public PictureController(PictureService pictureService) {
        this.pictureService = pictureService;
    }

    @PostMapping
    public PictureResponse create(@RequestBody PictureRequest pictureRequest) {
        return pictureService.create(pictureRequest);
    }

    @GetMapping("/{id}")
    public PictureResponse getById(@PathVariable Long id) {
        return pictureService.getById(id);
    }

    @GetMapping
    public List<PictureResponse> getAll() {
        return pictureService.getAll();
    }

    @PutMapping("/{id}")
    public PictureResponse update(@PathVariable Long id, @RequestBody PictureRequest pictureRequest) {
        return pictureService.update(id, pictureRequest);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        pictureService.delete(id);
        return "Picture deleted successfully";
    }
}