package com.moyamo.be.search.service;

import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.dictionary.entity.CountryGesture;
import com.moyamo.be.dictionary.entity.Gesture;
import com.moyamo.be.dictionary.entity.GestureInfo;
import com.moyamo.be.search.dto.GestureSearchResponseDto;
import com.moyamo.be.search.repository.GestureSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

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
        return getListApiResponse(countryGestures);
    }

    private ApiResponse<List<GestureSearchResponseDto>> getListApiResponse(List<CountryGesture> countryGestures) {

        Map<String, GestureSearchResponseDto> responseMap = new LinkedHashMap<>();

        for (CountryGesture cg : countryGestures) {
            Gesture gesture = cg.getGesture();
            GestureInfo gestureInfo = cg.getGestureInfo();
            String meaning = gestureInfo.getGestureMeaning();
            int gestureId = gesture.getGestureId();

            String key = gestureId + "::" + meaning;

            responseMap.putIfAbsent(key, new GestureSearchResponseDto(
                    gestureId,
                    gestureInfo.getGestureTitle(),
                    gesture.getImageUrl(),
                    new ArrayList<>()
            ));

            responseMap.get(key).getMeanings().add(new GestureSearchResponseDto.Meaning(
                    cg.getCountry().getCountryId(),
                    cg.getCountry().getImageUrl(),
                    cg.getCountry().getCountryName(),
                    meaning
            ));
        }

        return new ApiResponse<>(200, new ArrayList<>(responseMap.values()));
    }

    public ApiResponse<List<GestureSearchResponseDto>> findGestureByLabel(String gestureLabel, Integer countryId) {
        List<CountryGesture> countryGestures = gestureSearchRepository.findGesturesByGestureLabelAndCountryId(gestureLabel, countryId);

        if (countryGestures.isEmpty()) {
            return null;
        }

        return getListApiResponse(countryGestures);
    }
}
