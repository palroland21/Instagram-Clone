package com.instagram.clone.service;

import com.instagram.clone.model.Picture;
import com.instagram.clone.model.Post;
import com.instagram.clone.repository.PictureRepository;
import com.instagram.clone.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PictureService {

    private final PictureRepository pictureRepository;
    private final PostRepository postRepository;

    public PictureService(PictureRepository pictureRepository, PostRepository postRepository) {
        this.pictureRepository = pictureRepository;
        this.postRepository = postRepository;
    }

    public Picture create(Picture picture) {
        Post post = postRepository.findById(picture.getPost().getId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + picture.getPost().getId()));
        picture.setPost(post);
        return pictureRepository.save(picture);
    }

    public Picture getById(Long id) {
        return pictureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Picture not found with id: " + id));
    }

    public List<Picture> getAll() {
        return (List<Picture>) pictureRepository.findAll();
    }

    public Picture update(Long id, Picture updatedPicture) {
        Picture existing = getById(id);
        existing.setPictureURL(updatedPicture.getPictureURL());
        existing.setPost(updatedPicture.getPost());
        return pictureRepository.save(existing);
    }

    public void delete(Long id) {
        pictureRepository.deleteById(id);
    }
}