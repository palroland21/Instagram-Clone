package com.instagram.clone.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "dislikes")
@IdClass(DislikeId.class)
public class Dislike {



    @Id // aceasta se va potrivi cu 'Long user' din DislikeId
    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @Id // aceasta se va potrivi cu 'Long post' din DislikeId
    @ManyToOne
    @JoinColumn(name = "id_post")
    private Post post;

    private LocalDateTime createdAt = LocalDateTime.now();
}