package com.moyamo.be.dictionary.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class GestureDetailResponseDto {
    private int country_id;
    private String country_name;
    private String image_url;

    private int meaning_id;
    private int gesture_id;
    private String gesture_image;
    private String gesture_title;
    private String gesture_meaning;
    private String gesture_situation;
    private String gesture_others;
    private String gesture_tmi;

    @JsonProperty("is_positive")
    private boolean is_positive;
    private int multiple_gestures;
}
