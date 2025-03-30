package com.moyamo.be.tip.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TipResponseDto {
    private int tip_id;
    private int country_id;
    private String content;
}
