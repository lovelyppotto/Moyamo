package com.moyamo.be.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AnswerDto {
    private int answer_id;
    private Integer answer_option_id;
    private String correct_gesture_name;
}