package com.instagram.clone.model;

import com.instagram.clone.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;

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
    private String full_name;

    @Column
    private String bio;

    @Column
    private LocalDateTime created_at;

    @Column
    private String profile_picture;

    @Column(nullable = false)
    private Role role;


}
