package com.moyamo.be.quiz.dto;

import com.moyamo.be.quiz.entity.Answer;
import com.moyamo.be.quiz.entity.Question;
import com.moyamo.be.quiz.entity.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class QuizResponseDto {
    private int question_id;
    private String question_text;
    private String question_type;
    private List<OptionDto> options;
    private AnswerDto answer;
}
