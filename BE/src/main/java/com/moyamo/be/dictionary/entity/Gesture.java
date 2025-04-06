package com.moyamo.be.dictionary.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "gestures")
public class Gesture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gesture_id")
    private Integer gestureId;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "gesture_label")
    private String gestureLabel;

    @Column(name = "gesture_type")
    private String gestureType;
}
