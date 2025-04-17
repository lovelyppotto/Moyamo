package com.moyamo.be.quiz.controller;

import com.moyamo.be.common.ApiResponse;
import com.moyamo.be.quiz.dto.QuizResponseDto;
import com.moyamo.be.quiz.entity.Question;
import com.moyamo.be.quiz.entity.QuestionType;
import com.moyamo.be.quiz.service.QuizService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public ApiResponse<List<QuizResponseDto>> getQuiz(@RequestParam("type") List<QuestionType> types) {
        List<QuizResponseDto> quizList = quizService.getQuestionsByTypes(types);
        return new ApiResponse<>(200, quizList);
    }
}
