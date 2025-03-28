package com.moyamo.be.dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class GestureListWithCountryDto {
    private int country_id;
    private String country_name;
    private String image_url;
    private List<GestureListResponseDto> gestures;
}
