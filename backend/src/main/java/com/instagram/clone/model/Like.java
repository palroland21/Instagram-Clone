package com.instagram.clone.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "likes")
@IdClass(LikeId.class)
public class Like {


    @Id // acesta va fi parte din cheia compusa
    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @Id // tot o parte din cheia compusa
    @ManyToOne
    @JoinColumn(name = "id_post")
    private Post post;

    private LocalDateTime createdAt = LocalDateTime.now();
}