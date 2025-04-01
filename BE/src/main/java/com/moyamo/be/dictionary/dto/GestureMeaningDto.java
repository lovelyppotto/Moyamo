package com.moyamo.be.dictionary.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GestureMeaningDto {
    private String country_id;
    private String country_name;
    private String country_image_url;
    private String gesture_meaning;
    private String gesture_situation;
    @JsonProperty("is_positive")
    private boolean positive;
}
