package com.moyamo.be.dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class GestureListResponseDto {
    private int meaning_id;
    private int gesture_id;
    private String image_url;
    private String gesture_title;
    private String gesture_label;
    private int multiple_gestures;
}
