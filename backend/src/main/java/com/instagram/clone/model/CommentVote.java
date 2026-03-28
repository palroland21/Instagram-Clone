package com.instagram.clone.model;

import com.instagram.clone.model.enums.VoteType;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "comment_votes",uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","comment_id"}))
public class CommentVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "comment_id",nullable = false)
    private Comment comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private VoteType voteType;
}