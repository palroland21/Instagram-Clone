package com.instagram.clone.model;

import com.instagram.clone.model.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column
    private String bio;

    @Column
    private LocalDateTime createdAt;

    @Column
    private String profilePicture;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    private Double score = 0.0;

    @Column(nullable = false)
    private Boolean banned = false;

    @Column(name = "phone_number", nullable = false, length = 30)
    private String phoneNumber = "UNKNOWN";

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (role == null) {
            role = Role.USER;
        }
        if (score == null) {
            score = 0.0;
        }
        if(banned == null){
            banned = false;
        }
        if (phoneNumber == null || phoneNumber.isBlank()) {
            phoneNumber = "UNKNOWN";
        }
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_followers",
            joinColumns = @JoinColumn(name = "followed_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    private List<User> followers = new ArrayList<>();

    @ManyToMany(mappedBy = "followers", fetch = FetchType.LAZY)
    private List<User> following = new ArrayList<>();
}
