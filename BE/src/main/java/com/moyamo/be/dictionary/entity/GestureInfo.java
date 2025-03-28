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
@Table(name = "gesture_infos")
public class GestureInfo {
    @Id
    @Column(name = "info_id")
    private int infoId;

    @Column(name = "gesture_title")
    private String gestureTitle;

    @Column(name = "gesture_meaning")
    private String gestureMeaning;

    @Column(name = "gesture_situation")
    private String gestureSituation;

    @Column(name = "gesture_others")
    private String gestureOthers;

    @Column(name = "gesture_tmi")
    private String gestureTmi;

    @Column(name = "is_positive")
    private Boolean isPositive;
}
