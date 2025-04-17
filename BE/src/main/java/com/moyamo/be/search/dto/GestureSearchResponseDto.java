package com.moyamo.be.search.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class GestureSearchResponseDto {
    private int gesture_id;
    private String gesture_name;
    private String gesture_image;
    private List<Meaning> meanings;

    @Getter
    @AllArgsConstructor
    public static class Meaning {
        private int country_id;
        private String image_url;
        private String country_name;
        private String meaning;
    }
}
