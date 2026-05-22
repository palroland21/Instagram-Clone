package com.instagram.clone.repository;

import com.instagram.clone.model.Post;
import com.instagram.clone.model.PostVote;
import com.instagram.clone.model.User;
import com.instagram.clone.model.enums.VoteType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostVoteRepository extends CrudRepository<PostVote, Long> {
    Optional<PostVote> findByUserAndPost(User user, Post post);
    boolean existsByUserAndPost(User user, Post post);
    List<PostVote> findByPost(Post post);
    Optional<PostVote> findByUserIdAndPostId(Long userId, Long postId);
    long countByPostIdAndVoteType(Long postId, VoteType voteType);

    @Query("""
            select v
            from PostVote v
            join fetch v.user
            join fetch v.post p
            join fetch p.user
            where p.user.id = :ownerId
              and v.user.id <> :ownerId
            order by v.id desc
            """)
    List<PostVote> findNotificationsForPostOwner(@Param("ownerId") Long ownerId);
}
