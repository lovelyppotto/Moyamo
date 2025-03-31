package com.moyamo.be.quiz.repository;

import com.moyamo.be.dictionary.entity.CountryGesture;
import com.moyamo.be.quiz.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionRepository extends JpaRepository<Option, Integer> {
}
