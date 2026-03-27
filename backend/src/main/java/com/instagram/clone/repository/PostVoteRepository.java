package com.instagram.clone.repository;

import com.instagram.clone.model.Post;
import com.instagram.clone.model.PostVote;
import com.instagram.clone.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostVoteRepository extends CrudRepository<PostVote, Long> {
    Optional<PostVote> findByUserAndPost(User user, Post post);
    List<PostVote> findByPost(Post post);
}
