package com.moyamo.be.dictionary.service;

import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.dictionary.dto.GestureListResponseDto;
import com.moyamo.be.dictionary.dto.GestureListWithCountryDto;
import com.moyamo.be.dictionary.entity.Country;
import com.moyamo.be.dictionary.entity.CountryGesture;
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
                cg.getGesture().getGestureLabel()
        )).collect(Collectors.toList());

        GestureListWithCountryDto responseData = new GestureListWithCountryDto(
                country.getCountryId(),
                country.getCountryName(),
                country.getImageUrl(),
                gestureList
        );

        return new ApiResponse<>(200, responseData);
    }
}
