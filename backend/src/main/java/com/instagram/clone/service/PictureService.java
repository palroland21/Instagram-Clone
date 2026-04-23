package com.instagram.clone.service;

import com.instagram.clone.dto.request.PictureRequest;
import com.instagram.clone.dto.response.PictureResponse;
import com.instagram.clone.model.Picture;
import com.instagram.clone.model.Post;
import com.instagram.clone.repository.PictureRepository;
import com.instagram.clone.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PictureService {

    private final PictureRepository pictureRepository;
    private final PostRepository postRepository;

    public PictureService(PictureRepository pictureRepository, PostRepository postRepository) {
        this.pictureRepository = pictureRepository;
        this.postRepository = postRepository;
    }

    public PictureResponse create(PictureRequest pictureRequest) {
        Post post = postRepository.findById(pictureRequest.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + pictureRequest.getPostId()));

        Picture picture = new Picture();
        picture.setPictureUrl(pictureRequest.getUrl());
        picture.setPost(post);

        Picture savedPicture = pictureRepository.save(picture);
        return mapToResponse(savedPicture);
    }

    public PictureResponse getById(Long id) {
        Picture picture = pictureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Picture not found with id: " + id));

        return mapToResponse(picture);
    }

    public List<PictureResponse> getAll() {
        List<PictureResponse> pictures = new ArrayList<>();

        for (Picture picture : pictureRepository.findAll()) {
            pictures.add(mapToResponse(picture));
        }

        return pictures;
    }

    public PictureResponse update(Long id, PictureRequest pictureRequest) {
        Picture existing = pictureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Picture not found with id: " + id));

        Post post = postRepository.findById(pictureRequest.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + pictureRequest.getPostId()));

        existing.setPictureUrl(pictureRequest.getUrl());
        existing.setPost(post);

        Picture updatedPicture = pictureRepository.save(existing);
        return mapToResponse(updatedPicture);
    }

    public void delete(Long id) {
        Picture picture = pictureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Picture not found with id: " + id));

        pictureRepository.delete(picture);
    }

    private PictureResponse mapToResponse(Picture picture) {
        return new PictureResponse(
                picture.getId(),
                picture.getPictureUrl(),
                picture.getPost() != null ? picture.getPost().getId() : null
        );
    }
}