package com.instagram.clone.service;

import com.instagram.clone.dto.request.TagRequest;
import com.instagram.clone.dto.response.TagResponse;
import com.instagram.clone.model.Tag;
import com.instagram.clone.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public TagResponse create(TagRequest request) {
        Tag tag = new Tag();
        tag.setName(request.getName());

        Tag saved = tagRepository.save(tag);
        return mapToResponse(saved);
    }

    public TagResponse getById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));
        return mapToResponse(tag);
    }

    public List<TagResponse> getAll() {
        List<TagResponse> responses = new ArrayList<>();

        for (Tag tag : tagRepository.findAll()) {
            responses.add(mapToResponse(tag));
        }

        return responses;
    }

    public TagResponse update(Long id, TagRequest request) {
        Tag existing = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));

        existing.setName(request.getName());

        Tag updated = tagRepository.save(existing);
        return mapToResponse(updated);
    }

    public void delete(Long id) {
        tagRepository.deleteById(id);
    }

    private TagResponse mapToResponse(Tag tag) {
        TagResponse response = new TagResponse();
        response.setId(tag.getId());
        response.setName(tag.getName());
        return response;
    }
}