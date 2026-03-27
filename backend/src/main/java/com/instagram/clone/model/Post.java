package com.instagram.clone.model;

import com.instagram.clone.enums.PostStatus;
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
        @JoinColumn(name = "user_id",nullable = false)
        private User user;

        @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
//        @Column
        private List<Picture> pictures = new ArrayList<>();

        @Column
        private String pictureUrl;

        @Column
        private String location;

        @Column
        private String caption;

        @Column
        private String title;

        @Column(nullable = false)
        private LocalDateTime createdAt;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private PostStatus status;

        @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<PostVote> votes = new ArrayList<>();

        @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Comment> comments = new ArrayList<>();

        //persist -> daca fac un post nou, cu taguri noi, se vor salva si ele automat
        //merge -> cand fac update pe post se propaga si in tag
        @ManyToMany(cascade ={CascadeType.PERSIST, CascadeType.MERGE})
        @JoinTable(name="post_tags",
        joinColumns = @JoinColumn(name="post_id"),
        inverseJoinColumns = @JoinColumn(name="tag_id"))
        private List<Tag> tags = new ArrayList<>();
        //tabela post_tags va contine legaturile dintre post si tag
    }


