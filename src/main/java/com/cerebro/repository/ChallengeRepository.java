package com.cerebro.repository;

import com.cerebro.model.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    // no additional methods needed for now
}