package com.instagram.clone.repository;

import com.instagram.clone.model.Tag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends CrudRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
    boolean existsByName(String name);
    List<Tag> findByNameContainingIgnoreCase(String name);
}