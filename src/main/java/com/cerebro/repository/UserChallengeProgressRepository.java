package com.cerebro.repository;

import com.cerebro.model.UserChallengeProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserChallengeProgressRepository
        extends JpaRepository<UserChallengeProgress, Long> {

    List<UserChallengeProgress> findByUserId(Long userId);

    Optional<UserChallengeProgress> findByUserIdAndChallengeId(Long userId, Long challengeId);

    List<UserChallengeProgress> findByChallengeId(Long challengeId);
}