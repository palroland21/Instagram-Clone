package com.instagram.clone.service;

import com.instagram.clone.dto.request.PostRequest;
import com.instagram.clone.dto.response.PostResponse;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.Tag;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.PostStatus;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.TagRepository;
import com.instagram.clone.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository,
                       TagRepository tagRepository,
                       UserRepository userRepository) {
        this.postRepository = postRepository;
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
    }

    public PostResponse create(PostRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setPictureUrl(request.getPictureUrl());
        post.setLocation(request.getLocation());
        post.setCaption(request.getCaption());
        post.setTitle(request.getTitle());
        post.setCreatedAt(LocalDateTime.now());
        post.setStatus(request.getStatus() != null ? request.getStatus() : PostStatus.JUST_POSTED);
        post.setTags(getOrCreateTags(request.getTagNames()));

        Post saved = postRepository.save(post);
        return mapToResponse(saved);
    }

    public PostResponse getById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return mapToResponse(post);
    }

    public List<PostResponse> getAll() {
        List<PostResponse> responses = new ArrayList<>();

        for (Post post : postRepository.findAll()) {
            responses.add(mapToResponse(post));
        }

        return responses;
    }

    public PostResponse update(Long id, PostRequest request) {
        Post existing = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setUser(user);
        existing.setPictureUrl(request.getPictureUrl());
        existing.setLocation(request.getLocation());
        existing.setCaption(request.getCaption());
        existing.setTitle(request.getTitle());

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        existing.setTags(getOrCreateTags(request.getTagNames()));

        Post updated = postRepository.save(existing);
        return mapToResponse(updated);
    }

    public void delete(Long id) {
        postRepository.deleteById(id);
    }

    private List<Tag> getOrCreateTags(List<String> tagNames) {
        List<Tag> tags = new ArrayList<>();

        if (tagNames != null) {
            for (String tagName : tagNames) {
                if (tagName == null || tagName.trim().isEmpty()) {
                    continue;
                }

                String cleanTagName = tagName.trim().toLowerCase();

                Tag tag = tagRepository.findByName(cleanTagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(cleanTagName);
                            return tagRepository.save(newTag);
                        });

                tags.add(tag);
            }
        }

        return tags;
    }

    private PostResponse mapToResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setUserId(post.getUser().getId());
        response.setUsername(post.getUser().getUsername());
        response.setPictureUrl(post.getPictureUrl());
        response.setLocation(post.getLocation());
        response.setCaption(post.getCaption());
        response.setTitle(post.getTitle());
        response.setCreatedAt(post.getCreatedAt());
        response.setStatus(post.getStatus());

        List<Long> tagIds = new ArrayList<>();
        List<String> tagNames = new ArrayList<>();

        if (post.getTags() != null) {
            for (Tag tag : post.getTags()) {
                tagIds.add(tag.getId());
                tagNames.add(tag.getName());
            }
        }

        response.setTagIds(tagIds);
        response.setTagNames(tagNames);

        return response;
    }
}