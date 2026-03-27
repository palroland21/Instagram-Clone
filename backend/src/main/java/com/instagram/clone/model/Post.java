package com.instagram.clone.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "posts")
public class Post {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id_post;

        @ManyToOne
        @JoinColumn(name = "id_user", referencedColumnName = "id")
//        @Column(unique = true, nullable = false)
        private User user;

        @Column
        private String profile_picture;


        @OneToMany
        @Column(nullable = false)
        private List<Picture> post_picture;

        @Column
        private String location;

        @Column
        private String caption;

        @Column
        private LocalDateTime created_at;

        @Column
        private Long nbLikes;

        @Column
        private Long nbDislikes;


    }


