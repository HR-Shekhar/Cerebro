package com.cerebro.service;

import com.cerebro.model.Challenge;
import com.cerebro.model.ChallengeType;
import com.cerebro.model.UserChallengeProgress;
import com.cerebro.repository.ChallengeRepository;
import com.cerebro.repository.UserChallengeProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ChallengeService {
    private final ChallengeRepository challengeRepo;
    private final UserChallengeProgressRepository progressRepo;

    public ChallengeService(ChallengeRepository challengeRepo,
                            UserChallengeProgressRepository progressRepo) {
        this.challengeRepo = challengeRepo;
        this.progressRepo  = progressRepo;
    }

    public List<Challenge> getAllChallenges() {
        return challengeRepo.findAll();
    }

    /** Create a new challenge and initialize progress for userId=1 */
    @Transactional
    public Challenge createChallenge(Long userId, Challenge challenge) {
        Challenge saved = challengeRepo.save(challenge);

        UserChallengeProgress initial = new UserChallengeProgress();
        initial.setUserId(userId);
        initial.setChallenge(saved);
        initial.setCurrentValue(0);
        initial.setCompleted(false);
        initial.setLastUpdated(LocalDate.now());
        progressRepo.save(initial);

        return saved;
    }

    /** Called after saving a StudySession */
    @Transactional
    public void updateProgressFromSession(long minutes, long userId) {
        // Minutes challenges
        challengeRepo.findAll().stream()
            .filter(c -> c.getType() == ChallengeType.HOURS)
            .forEach(ch -> progressRepo.findByUserIdAndChallengeId(userId, ch.getId())
                .ifPresent(p -> {
                    int updated = p.getCurrentValue() + (int) minutes;
                    p.setCurrentValue(updated);
                    if (updated >= (ch.getTargetValue() > 0 ? ch.getTargetValue() : ch.getTargetMinutes())) {
                        p.setCompleted(true);
                    }
                    p.setLastUpdated(LocalDate.now());
                    progressRepo.save(p);
                })
            );

        // SESSION_COUNT challenges
        challengeRepo.findAll().stream()
            .filter(c -> c.getType() == ChallengeType.SESSION_COUNT)
            .forEach(ch -> progressRepo.findByUserIdAndChallengeId(userId, ch.getId())
                .ifPresent(p -> {
                    int updated = p.getCurrentValue() + 1;
                    p.setCurrentValue(updated);
                    if (updated >= ch.getTargetValue()) {
                        p.setCompleted(true);
                    }
                    p.setLastUpdated(LocalDate.now());
                    progressRepo.save(p);
                })
            );
    }

    /** Called after computing current streak */
    @Transactional
    public void updateProgressFromStreak(int streakDays, long userId) {
        challengeRepo.findAll().stream()
            .filter(c -> c.getType() == ChallengeType.STREAK)
            .forEach(ch -> progressRepo.findByUserIdAndChallengeId(userId, ch.getId())
                .ifPresent(p -> {
                    p.setCurrentValue(streakDays);
                    if (streakDays >= ch.getTargetValue()) {
                        p.setCompleted(true);
                    }
                    p.setLastUpdated(LocalDate.now());
                    progressRepo.save(p);
                })
            );
    }

    public List<UserChallengeProgress> getProgressForUser(Long userId) {
        return progressRepo.findByUserId(userId);
    }

    @Transactional
    public void deleteChallengeAndProgress(Long challengeId) {
        progressRepo.findByChallengeId(challengeId)
                    .forEach(progressRepo::delete);
        challengeRepo.deleteById(challengeId);
    }
}