package com.moyamo.be.dictionary.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.dictionary.dto.*;
import com.moyamo.be.dictionary.entity.Country;
import com.moyamo.be.dictionary.entity.CountryGesture;
import com.moyamo.be.dictionary.entity.Gesture;
import com.moyamo.be.dictionary.entity.GestureInfo;
import com.moyamo.be.dictionary.repository.CountryGestureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DictionaryService {
    private final CountryGestureRepository countryGestureRepository;

    public ApiResponse<GestureListWithCountryDto> getGesturesByCountry(Integer countryId) {
        List<CountryGesture> gestures = countryGestureRepository.findByCountry_CountryIdAndGestureInfo_GestureTitleIsNotNull(countryId);

        Country country = gestures.get(0).getCountry();
        List<GestureListResponseDto> gestureList = gestures.stream()
                .map(cg -> {
                    int gestureId = cg.getGesture().getGestureId();
                    int multiple = countryGestureRepository.countOtherCountriesByGestureId(gestureId);
                    return new GestureListResponseDto(
                            cg.getMeaningId().intValue(),
                            gestureId,
                            cg.getGesture().getImageUrl(),
                            cg.getGestureInfo().getGestureTitle(),
                            multiple
                    );
                })
                .collect(Collectors.toList());

        GestureListWithCountryDto responseData = new GestureListWithCountryDto(
                country.getCountryId(),
                country.getCountryName(),
                country.getImageUrl(),
                gestureList
        );

        return new ApiResponse<>(200, responseData);
    }

    public ApiResponse<GestureDetailResponseDto> getGestureDetail(int gestureId, int countryId) {
        CountryGesture cg = countryGestureRepository
                .findByGesture_GestureIdAndCountry_CountryId(gestureId, countryId)
                .orElseThrow(() -> new NotFoundException("제스처 데이터를 찾을 수 없습니다."));

        Gesture gesture = cg.getGesture();
        Country country = cg.getCountry();
        GestureInfo info = cg.getGestureInfo();

        int multiple = countryGestureRepository.countOtherCountriesByGestureId(gestureId);

        GestureDetailResponseDto detail = new GestureDetailResponseDto(
                country.getCountryId(),
                country.getCountryName(),
                country.getImageUrl(),
                gesture.getGestureLabel(),

                cg.getMeaningId(),
                gesture.getGestureId(),
                gesture.getImageUrl(),
                info.getGestureTitle(),
                info.getGestureMeaning(),
                info.getGestureSituation(),
                info.getGestureOthers(),
                info.getGestureTmi(),
                info.getIsPositive(),

                multiple
        );

        return new ApiResponse<>(200, detail);
    }

    public ApiResponse<CountryGestureResponseDto> getGestureCompare(int gestureId) {
        List<CountryGesture> list = countryGestureRepository.findByGesture_GestureId(gestureId);
        if (list.isEmpty()) {
            throw new NotFoundException("gesture_id에 대한 정보 없음 " + gestureId);
        }

        String imageUrl = list.get(0).getGesture().getImageUrl();

        Map<String, List<CountryGesture>> grouped = list.stream()
                .collect(Collectors.groupingBy(cg ->
                        cg.getGestureInfo().getGestureMeaning() + "|" +
                                cg.getGestureInfo().getGestureSituation() + "|" +
                                cg.getGestureInfo().getIsPositive()
                ));

        List<GestureMeaningDto> meanings = new ArrayList<>();
        for (Map.Entry<String, List<CountryGesture>> entry : grouped.entrySet()) {
            List<CountryGesture> groupList = entry.getValue();

            CountryGesture first = groupList.get(0);
            String gestureMeaning = first.getGestureInfo().getGestureMeaning();
            String gestureSituation = first.getGestureInfo().getGestureSituation();
            boolean isPositive = first.getGestureInfo().getIsPositive();

            String countryNames = groupList.stream()
                    .map(cg -> cg.getCountry().getCountryName())
                    .distinct()
                    .collect(Collectors.joining(","));

            String countryIds = groupList.stream()
                    .map(cg -> String.valueOf(cg.getCountry().getCountryId()))
                    .distinct()
                    .collect(Collectors.joining(","));

            meanings.add(new GestureMeaningDto(countryIds, countryNames, gestureMeaning, gestureSituation, isPositive));
        }

        CountryGestureResponseDto responseDto =
                new CountryGestureResponseDto(gestureId, imageUrl, meanings);

        return new ApiResponse<>(200, responseDto);
    }
}
