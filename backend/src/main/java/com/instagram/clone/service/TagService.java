package com.instagram.clone.service;

import com.instagram.clone.model.Tag;
import com.instagram.clone.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public Tag create(Tag tag) {
        return tagRepository.save(tag);
    }

    public Tag getById(Long id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));
    }

    public List<Tag> getAll() {
        return (List<Tag>) tagRepository.findAll();
    }

    public Tag update(Long id, Tag updatedTag) {
        Tag existing = getById(id);
        existing.setName(updatedTag.getName());
        return tagRepository.save(existing);
    }

    public void delete(Long id) {
        tagRepository.deleteById(id);
    }
}