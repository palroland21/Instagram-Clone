package com.instagram.clone.repository;

import com.instagram.clone.model.Picture;
import com.instagram.clone.model.Post;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PictureRepository extends CrudRepository<Picture, Long> {
    List<Picture> findByPost(Post post);
}
