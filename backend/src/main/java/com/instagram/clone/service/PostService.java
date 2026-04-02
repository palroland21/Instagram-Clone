package com.instagram.clone.service;

import com.instagram.clone.model.Picture;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.Tag;
import com.instagram.clone.model.enums.PostStatus;
import com.instagram.clone.repository.PostRepository;
import com.instagram.clone.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;

    public PostService(PostRepository postRepository, TagRepository tagRepository) {
        this.postRepository = postRepository;
        this.tagRepository = tagRepository;
    }

    public Post create(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        if (post.getStatus() == null) {
            post.setStatus(PostStatus.JUST_POSTED);
        }
        if (post.getTags() != null) {
            List<Tag> managedTags = post.getTags().stream()
                    .map(tag -> tagRepository.findById(tag.getId())
                            .orElseThrow(() -> new RuntimeException("Tag not found: " + tag.getId())))
                    .collect(Collectors.toList());
            post.setTags(managedTags);
        }
        return postRepository.save(post);
    }

    public Post getById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    public List<Post> getAll() {
        return (List<Post>) postRepository.findAll();
    }

    public Post update(Long id, Post updatedPost) {
        Post existing = getById(id);
        existing.setUser(updatedPost.getUser());
        existing.setPictures(updatedPost.getPictures());
        existing.setPictureUrl(updatedPost.getPictureUrl());
        existing.setLocation(updatedPost.getLocation());
        existing.setCaption(updatedPost.getCaption());
        existing.setTitle(updatedPost.getTitle());
        existing.setStatus(updatedPost.getStatus());
        existing.setTags(updatedPost.getTags());

        if(updatedPost.getPictures() != null) {
            for(Picture picture : updatedPost.getPictures()) {
                picture.setPost(existing);
                existing.getPictures().add(picture);
            }
        }


        return postRepository.save(existing);
    }

    public void delete(Long id) {
        postRepository.deleteById(id);
    }
}