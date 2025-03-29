package com.moyamo.be.dictionary.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.dictionary.dto.GestureDetailResponseDto;
import com.moyamo.be.dictionary.dto.GestureListResponseDto;
import com.moyamo.be.dictionary.dto.GestureListWithCountryDto;
import com.moyamo.be.dictionary.entity.Country;
import com.moyamo.be.dictionary.entity.CountryGesture;
import com.moyamo.be.dictionary.entity.Gesture;
import com.moyamo.be.dictionary.entity.GestureInfo;
import com.moyamo.be.dictionary.repository.CountryGestureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DictionaryService {
    private final CountryGestureRepository countryGestureRepository;

    public ApiResponse<GestureListWithCountryDto> getGesturesByCountry(Integer countryId) {
        List<CountryGesture> gestures = countryGestureRepository.findByCountry_CountryId(countryId);

        Country country = gestures.get(0).getCountry();
        List<GestureListResponseDto> gestureList = gestures.stream().map(cg -> new GestureListResponseDto(
                cg.getMeaningId().intValue(),
                cg.getGesture().getGestureId().intValue(),
                cg.getGesture().getImageUrl(),
                cg.getGestureInfo().getGestureTitle()
        )).collect(Collectors.toList());

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
}
