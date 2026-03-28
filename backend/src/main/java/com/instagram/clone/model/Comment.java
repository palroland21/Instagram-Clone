package com.instagram.clone.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@Entity
@Table(name = "comments")
public class Comment {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @ManyToOne
        @JoinColumn(name = "post_id",nullable = false)
        private Post post;

        @Column
        private String text;

        @Column
        private String pictureUrl;

        @Column
        private LocalDateTime postedAt;

        @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<CommentVote> votes = new ArrayList<>();
}
