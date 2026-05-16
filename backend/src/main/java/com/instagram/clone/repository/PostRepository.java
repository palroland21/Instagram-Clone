package com.instagram.clone.repository;

import com.instagram.clone.model.Post;
import com.instagram.clone.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends CrudRepository<Post, Long> {
   List<Post> findAllByOrderByCreatedAtDesc();
   List<Post> findByUserOrderByCreatedAtDesc(User user);
   List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
   List<Post> findByTagsNameIgnoreCaseOrderByCreatedAtDesc(String tagName);
   List<Post> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);

   //descending posts sort after createdAt time
   @Query("""
           select distinct p
           from Post p
           left join p.tags t
           where (:tag is null or lower(t.name) = lower(:tag))
             and (:userId is null or p.user.id = :userId)
             and (:text is null
                  or lower(p.title) like lower(concat('%', :text, '%'))
                  or lower(p.caption) like lower(concat('%', :text, '%'))
                  or lower(p.user.username) like lower(concat('%', :text, '%'))
                  or lower(t.name) like lower(concat('%', :text, '%')))
           order by p.createdAt desc
           """)
   List<Post> searchPosts(
           @Param("tag") String tag,
           @Param("text") String text,
           @Param("userId") Long userId
   );
}
