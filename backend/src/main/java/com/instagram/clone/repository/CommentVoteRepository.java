package com.instagram.clone.repository;

import com.instagram.clone.model.Comment;
import com.instagram.clone.model.CommentVote;
import com.instagram.clone.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentVoteRepository extends CrudRepository<CommentVote, Long> {
    Optional<CommentVote> findByUserAndComment(User user, Comment comment);
    List<CommentVote> findByComment(Comment comment);
}
