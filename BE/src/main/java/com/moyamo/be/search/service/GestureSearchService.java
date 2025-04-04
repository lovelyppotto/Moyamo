package com.moyamo.be.search.service;

import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.dictionary.entity.CountryGesture;
import com.moyamo.be.dictionary.entity.Gesture;
import com.moyamo.be.search.dto.GestureSearchResponseDto;
import com.moyamo.be.search.repository.GestureSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GestureSearchService {

    private final GestureSearchRepository gestureSearchRepository;

    public ApiResponse<List<GestureSearchResponseDto>> findGestureByNameAndCountry(String gestureName, Integer countryId) {

        List<CountryGesture> countryGestures = gestureSearchRepository.findGesturesByTitleAndCountry(gestureName, countryId);

        if (countryGestures.isEmpty()) {
            return new ApiResponse<>(404, null);
        }

        // gesture_id 별로 그룹화
        Map<Integer, GestureSearchResponseDto> responseMap = new HashMap<>();

        for (CountryGesture cg : countryGestures) {
            Gesture gesture = cg.getGesture();
            int gestureId = gesture.getGestureId();

            // gesture_id가 없으면 새로 추가
            responseMap.putIfAbsent(gestureId, new GestureSearchResponseDto(
                    gesture.getGestureId(),
                    gesture.getGestureLabel(),
                    gesture.getImageUrl(),
                    new ArrayList<>()
            ));

            // meanings 리스트에 의미 추가
            responseMap.get(gestureId).getMeanings().add(new GestureSearchResponseDto.Meaning(
                    cg.getCountry().getCountryId(),
                    cg.getCountry().getImageUrl(),
                    cg.getCountry().getCountryName(),
                    cg.getGestureInfo().getGestureMeaning()
            ));
        }

        return new ApiResponse<>(200, new ArrayList<>(responseMap.values()));
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
