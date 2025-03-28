package com.moyamo.be.dictionary.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "countries")
public class Country {
    @Id
    @Column(name = "country_id")
    private int countryId;

    @Column(name = "country_name")
    private String countryName;

    @Column(name = "image_url")
    private String imageUrl;
}
