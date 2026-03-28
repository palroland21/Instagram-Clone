package com.instagram.clone.controller;

import com.instagram.clone.model.Tag;
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
    public Tag create(@RequestBody Tag tag) {
        return tagService.create(tag);
    }

    @GetMapping("/{id}")
    public Tag getById(@PathVariable Long id) {
        return tagService.getById(id);
    }

    @GetMapping
    public List<Tag> getAll() {
        return tagService.getAll();
    }

    @PutMapping("/{id}")
    public Tag update(@PathVariable Long id, @RequestBody Tag updatedTag) {
        return tagService.update(id, updatedTag);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        tagService.delete(id);
        return "Tag deleted successfully";
    }
}
