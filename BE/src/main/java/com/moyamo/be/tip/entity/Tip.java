package com.moyamo.be.tip.entity;

import com.moyamo.be.dictionary.entity.Country;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "tips")
public class Tip {
    @Id
    @Column(name = "tip_id")
    private int tipId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;

    @Column(name = "tip_content")
    private String tipContent;
}