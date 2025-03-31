package com.moyamo.be.quiz.repository;

import com.moyamo.be.dictionary.entity.CountryGesture;
import com.moyamo.be.quiz.entity.Question;
import com.moyamo.be.quiz.entity.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByQuestionTypeIn(List<QuestionType> types);
}
