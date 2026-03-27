package com.instagram.clone.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;


@Data
@Entity
@Table(name = "comments")
public class Comment {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id_comm;

        @ManyToOne
        @JoinColumn(name = "id_user", referencedColumnName = "id")
//        @Column(unique = true, nullable = false)
        private User user;

        @ManyToOne
        @JoinColumn(name = "id_post", referencedColumnName = "id_post")
//        @Column(unique = true, nullable = false)
        private Post post;

         @Column
         private String profile_picture;

         @Column
         private String caption;

         @Column
         private LocalDateTime posted_at;

        @Column
        private Long nbLikes;

        @Column
        private Long nbDislikes;






}
