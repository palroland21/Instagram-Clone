package com.instagram.clone.controller;

import com.instagram.clone.model.Picture;
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
    public Picture create(@RequestBody Picture picture) {
        return pictureService.create(picture);
    }

    @GetMapping("/{id}")
    public Picture getById(@PathVariable Long id) {
        return pictureService.getById(id);
    }

    @GetMapping
    public List<Picture> getAll() {
        return pictureService.getAll();
    }

    @PutMapping("/{id}")
    public Picture update(@PathVariable Long id, @RequestBody Picture updatedPicture) {
        return pictureService.update(id, updatedPicture);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        pictureService.delete(id);
        return "Picture deleted successfully";
    }
}