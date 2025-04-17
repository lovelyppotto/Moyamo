package com.moyamo.be.quiz.entity;

import com.moyamo.be.dictionary.entity.Gesture;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "options")
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "option_id")
    private int optionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gesture_id")
    private Gesture gesture;

    @Column(name = "option_meaning")
    private String optionMeaning;

    @Column(name = "is_answer")
    private boolean isAnswer;
}
