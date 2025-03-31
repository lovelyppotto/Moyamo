package com.moyamo.be.search.controller;

import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.search.dto.GestureSearchResponseDto;
import com.moyamo.be.search.service.GestureSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class GestureSearchController {

    private final GestureSearchService gestureSearchService;

    @GetMapping
    public ApiResponse<GestureSearchResponseDto> getGestureSearchResult(@RequestParam("gesture_name") String gestureName,
                                                                        @RequestParam("country_id") Integer countryId) {
        return gestureSearchService.findGestureByNameAndCountry(gestureName, countryId);
    }
}
