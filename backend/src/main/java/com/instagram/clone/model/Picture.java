package com.instagram.clone.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.ArrayList;

@Data
@Entity
@Table(name = "pictures")

public class Picture {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id_picture;

        @Column
        private String pictureURL;



}
