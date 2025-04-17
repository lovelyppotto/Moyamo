package com.moyamo.be.dictionary.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "country_gestures")
public class CountryGesture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meaning_id")
    private Integer meaningId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gesture_id")
    private Gesture gesture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "info_id")
    private GestureInfo gestureInfo;

}
