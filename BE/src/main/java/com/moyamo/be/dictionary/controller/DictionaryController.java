package com.moyamo.be.dictionary.controller;

import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.dictionary.dto.GestureListResponseDto;
import com.moyamo.be.dictionary.dto.GestureListWithCountryDto;
import com.moyamo.be.dictionary.service.DictionaryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/gestures")
public class DictionaryController {
    private final DictionaryService dictionaryService;

    public DictionaryController(DictionaryService dictionaryService) {
        this.dictionaryService = dictionaryService;
    }

    @GetMapping
    public ApiResponse<GestureListWithCountryDto> getGesturesByCountry(@RequestParam("country_id") int countryId) {
        return dictionaryService.getGesturesByCountry(countryId);
    }
}
