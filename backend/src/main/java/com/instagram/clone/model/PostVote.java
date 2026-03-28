package com.instagram.clone.model;

import com.instagram.clone.model.enums.VoteType;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "post_votes",uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"}))
public class PostVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id",nullable = false)
    private Post post;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private VoteType voteType;
}