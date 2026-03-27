package com.instagram.clone.model;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DislikeId implements Serializable {
    private Long user;
    private Long post;
}