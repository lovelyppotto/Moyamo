package com.moyamo.be.dictionary.repository;

import com.moyamo.be.dictionary.entity.CountryGesture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryGestureRepository extends JpaRepository<CountryGesture, Integer> {
    List<CountryGesture> findByCountry_CountryId(Integer countryId);

    Optional<CountryGesture> findByGesture_GestureIdAndCountry_CountryId(Integer gestureId, Integer countryId);


    // 특정 gesture_id를 가진 country_gesture 중 country_id가 1~5가 아닌 것 개수(multiple 확인)
    @Query("SELECT COUNT(cg) FROM CountryGesture cg WHERE cg.gesture.gestureId = :gestureId AND cg.country.countryId NOT IN (1,2,3,4,5)")
    int countOtherCountriesByGestureId(@Param("gestureId") Integer gestureId);

    List<CountryGesture> findByGesture_GestureId(Integer gestureId);
}
