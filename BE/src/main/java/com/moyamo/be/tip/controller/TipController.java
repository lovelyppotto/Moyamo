package com.moyamo.be.tip.controller;

import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.tip.dto.TipResponseDto;
import com.moyamo.be.tip.service.TipService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/tips")
@RestController
public class TipController {
    private final TipService tipService;

    public TipController(TipService tipService) {
        this.tipService = tipService;
    }

    @GetMapping
    public ApiResponse<List<TipResponseDto>> getTip() {
        return tipService.getTips();
    }
}
