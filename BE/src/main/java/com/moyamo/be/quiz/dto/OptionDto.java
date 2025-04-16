package com.moyamo.be.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OptionDto {
    private int option_id;
    private String option_meaning;
    private Integer gesture_id;
    private String gesture_image;
}
