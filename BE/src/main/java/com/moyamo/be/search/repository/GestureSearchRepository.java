package com.moyamo.be.search.repository;

import com.moyamo.be.dictionary.entity.CountryGesture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GestureSearchRepository extends JpaRepository<CountryGesture, Integer> {

    @Query("""
        SELECT cg FROM CountryGesture cg
        JOIN FETCH cg.gesture g
        JOIN FETCH cg.country c
        JOIN FETCH cg.gestureInfo gi
        WHERE gi.gestureTitle LIKE %:gestureName%
        AND (:countryId = 0 OR c.countryId = :countryId)
    """)
    List<CountryGesture> findGesturesByTitleAndCountry(@Param("gestureName") String gestureName,
                                                       @Param("countryId") int countryId);

}
