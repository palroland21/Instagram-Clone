package com.instagram.clone.model;

import java.io.Serializable;
import lombok.Data;

@Data
public class LikeId implements Serializable {
    private Long user;
    private Long post;
}
