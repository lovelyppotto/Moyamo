package com.moyamo.be.quiz.service;

import com.moyamo.be.quiz.dto.AnswerDto;
import com.moyamo.be.quiz.dto.OptionDto;
import com.moyamo.be.quiz.dto.QuizResponseDto;
import com.moyamo.be.quiz.entity.Answer;
import com.moyamo.be.quiz.entity.Question;
import com.moyamo.be.quiz.entity.QuestionType;
import com.moyamo.be.quiz.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class QuizService {
    private final QuestionRepository questionRepository;

    public QuizService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<QuizResponseDto> getQuestionsByTypes(List<QuestionType> types) {
        List<Question> questions = questionRepository.findByQuestionTypeIn(types);

        for (Question question : questions) {
            System.out.println(question.getQuestionId());
        }
        if (questions.size() > 5) {
            Collections.shuffle(questions);
            questions = questions.stream().limit(5).collect(Collectors.toList());
        }

        return questions.stream().map(this::convertQuestionToDto).collect(Collectors.toList());
    }

    private QuizResponseDto convertQuestionToDto(Question question) {
        List<OptionDto> optionDtos = question.getOptions().stream().map(option -> {
            if (question.getQuestionType() == QuestionType.MEANING) {
                return new OptionDto(
                        option.getOptionId(),
                        option.getOptionMeaning(),
                        null,
                        null
                );
            } else if (question.getQuestionType() == QuestionType.GESTURE) {
                return new OptionDto(
                        option.getOptionId(),
                        null,
                        option.getGesture() != null ? option.getGesture().getGestureId() : null,
                        option.getGesture() != null ? option.getGesture().getImageUrl() : null
                );
            } else {
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());

        Answer answerEntity = question.getAnswer();
        AnswerDto answerDto = null;
        String gestureUrl = null;
        String gestureType = null;
        if (answerEntity != null) {
            if (question.getQuestionType() == QuestionType.MEANING) {
                answerDto = new AnswerDto(
                        answerEntity.getAnswerId(),
                        answerEntity.getOption() != null ? answerEntity.getOption().getOptionId() : null,
                        null
                );
                gestureUrl = answerEntity.getGesture() != null ? answerEntity.getGesture().getImageUrl() : null;
            } else if (question.getQuestionType() == QuestionType.GESTURE) {
                answerDto = new AnswerDto(
                        answerEntity.getAnswerId(),
                        answerEntity.getOption() != null ? answerEntity.getOption().getOptionId() : null,
                        answerEntity.getGesture() != null ? answerEntity.getGesture().getGestureLabel() : null
                );
            } else if (question.getQuestionType() == QuestionType.CAMERA) {
                answerDto = new AnswerDto(
                        answerEntity.getAnswerId(),
                        null,
                        answerEntity.getGesture() != null ? answerEntity.getGesture().getGestureLabel() : null
                );
                gestureType = answerEntity.getGesture() != null ? answerEntity.getGesture().getGestureType().name() : null;
            }
        }

        return new QuizResponseDto(
                question.getQuestionId(),
                question.getQuestionText(),
                question.getQuestionType().name(),
                gestureType,
                gestureUrl,
                optionDtos,
                answerDto
        );
    }
}
