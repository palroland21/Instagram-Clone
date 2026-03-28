package com.instagram.clone.repository;

import com.instagram.clone.model.Comment;
import com.instagram.clone.model.Post;
import com.instagram.clone.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends CrudRepository<Comment, Long> {
    List<Comment> findByPostOrderByPostedAtAsc(Post post);
    List<Comment> findByUser(User user);
}
