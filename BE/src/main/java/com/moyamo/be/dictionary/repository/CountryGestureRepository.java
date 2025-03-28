package com.moyamo.be.dictionary.repository;

import com.moyamo.be.dictionary.entity.CountryGesture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CountryGestureRepository extends JpaRepository<CountryGesture, Integer> {
    List<CountryGesture> findByCountry_CountryId(Integer countryId);

}
