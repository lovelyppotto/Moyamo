package com.moyamo.be.tip.repository;

import com.moyamo.be.dictionary.entity.CountryGesture;
import com.moyamo.be.tip.entity.Tip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipRepository extends JpaRepository<Tip, Integer> {

}
