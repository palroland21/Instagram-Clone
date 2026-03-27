package com.instagram.clone.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true,nullable=false)
    private String name; //ex: food, travel, tech, ai
}
