package com.moyamo.be.dictionary.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "gestures")
public class Gesture {
    @Id
    @Column(name = "gesture_id")
    private Integer gestureId;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "gesture_label")
    private String gestureLabel;
}
