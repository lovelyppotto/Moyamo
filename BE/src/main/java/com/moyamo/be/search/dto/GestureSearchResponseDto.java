package com.moyamo.be.search.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class GestureSearchResponseDto {
    private int gestureId;
    private String gestureName;
    private String gestureImage;
    private List<Meaning> meanings;

    @Getter
    @AllArgsConstructor
    public static class Meaning {
        private int countryId;
        private String countryName;
        private String meaning;
    }
}
