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

        @ManyToOne
        @JoinColumn(name = "post_id", nullable = false)
        private Post post; //picture trb sa stie de care post apartine
}
