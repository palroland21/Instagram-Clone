package com.instagram.clone.controller;

import com.instagram.clone.dto.request.TagRequest;
import com.instagram.clone.dto.response.TagResponse;
import com.instagram.clone.service.TagService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping
    public TagResponse create(@RequestBody TagRequest request) {
        return tagService.create(request);
    }

    @GetMapping("/{id}")
    public TagResponse getById(@PathVariable Long id) {
        return tagService.getById(id);
    }

    @GetMapping
    public List<TagResponse> getAll() {
        return tagService.getAll();
    }

    @PutMapping("/{id}")
    public TagResponse update(@PathVariable Long id, @RequestBody TagRequest request) {
        return tagService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        tagService.delete(id);
        return "Tag deleted successfully";
    }
}