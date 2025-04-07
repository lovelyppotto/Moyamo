package com.moyamo.be.dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CountryGestureResponseDto {
    private int gesture_id;
    private String image_url;

    private List<GestureMeaningDto> meanings;
}
