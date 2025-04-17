package com.moyamo.be.tip.service;

import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.tip.dto.TipResponseDto;
import com.moyamo.be.tip.entity.Tip;
import com.moyamo.be.tip.repository.TipRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class TipService {

    private final TipRepository tipRepository;

    public TipService(TipRepository tipRepository) {
        this.tipRepository = tipRepository;
    }

    public ApiResponse<List<TipResponseDto>> getTips() {
        List<Tip> tips = tipRepository.findAll();

        Map<Integer, List<Tip>> grouped = tips.stream()
                .collect(Collectors.groupingBy(tip -> tip.getCountry().getCountryId()));

        List<TipResponseDto> result = new ArrayList<>();
        Random random = new Random();
        for (Map.Entry<Integer, List<Tip>> entry : grouped.entrySet()) {
            List<Tip> tipList = entry.getValue();
            Tip randomTip = tipList.get(random.nextInt(tipList.size()));
            result.add(new TipResponseDto(
                    randomTip.getTipId(),
                    randomTip.getCountry().getCountryId(),
                    randomTip.getTipContent()
            ));
        }
        return new ApiResponse<>(200, result);
    }
}
