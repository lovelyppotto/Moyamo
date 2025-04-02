package com.moyamo.be.search.service;

import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.dictionary.entity.CountryGesture;
import com.moyamo.be.dictionary.entity.Gesture;
import com.moyamo.be.search.dto.GestureSearchResponseDto;
import com.moyamo.be.search.repository.GestureSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GestureSearchService {

    private final GestureSearchRepository gestureSearchRepository;

    public ApiResponse<GestureSearchResponseDto> findGestureByNameAndCountry(String gestureName, Integer countryId) {
        List<CountryGesture> countryGestures = gestureSearchRepository.findGesturesByTitleAndCountry(gestureName, countryId);

        if (countryGestures.isEmpty()) {
            return null;
        }

        Gesture gesture = countryGestures.get(0).getGesture();

        List<GestureSearchResponseDto.Meaning> meanings = countryGestures.stream()
                .map(cg -> new GestureSearchResponseDto.Meaning(
                        cg.getCountry().getCountryId(),
                        cg.getCountry().getImageUrl(),
                        cg.getCountry().getCountryName(),
                        cg.getGestureInfo().getGestureMeaning()))
                .collect(Collectors.toList());

        GestureSearchResponseDto gestureSearchResponseDto = new GestureSearchResponseDto(
                gesture.getGestureId(),
                gesture.getGestureLabel(),
                gesture.getImageUrl(),
                meanings
        );

        return new ApiResponse<>(200, gestureSearchResponseDto);
    }

    public ApiResponse<GestureSearchResponseDto> findGestureByLabel(String gestureLabel, Integer countryId) {
        List<CountryGesture> countryGestures = gestureSearchRepository.findGesturesByGestureLabelAndCountryId(gestureLabel, countryId);

        if (countryGestures.isEmpty()) {
            return null;
        }

        Gesture gesture = countryGestures.get(0).getGesture();

        List<GestureSearchResponseDto.Meaning> meanings = countryGestures.stream()
                .map(cg -> new GestureSearchResponseDto.Meaning(
                        cg.getCountry().getCountryId(),
                        cg.getCountry().getImageUrl(),
                        cg.getCountry().getCountryName(),
                        cg.getGestureInfo().getGestureMeaning()))
                .collect(Collectors.toList());

        GestureSearchResponseDto gestureSearchResponseDto = new GestureSearchResponseDto(
                gesture.getGestureId(),
                gesture.getGestureLabel(),
                gesture.getImageUrl(),
                meanings
        );

        return new ApiResponse<>(200, gestureSearchResponseDto);
    }
}
