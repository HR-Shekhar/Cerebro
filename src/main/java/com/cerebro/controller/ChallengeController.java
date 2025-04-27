package com.cerebro.controller;

import com.cerebro.model.Challenge;
import com.cerebro.model.UserChallengeProgress;
import com.cerebro.repository.ChallengeRepository;
import com.cerebro.repository.UserChallengeProgressRepository;
import com.cerebro.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;
    private final ChallengeRepository challengeRepo;
    private final UserChallengeProgressRepository progressRepo;

    @Autowired
    public ChallengeController(ChallengeService challengeService,
                               ChallengeRepository challengeRepo,
                               UserChallengeProgressRepository progressRepo) {
        this.challengeService = challengeService;
        this.challengeRepo    = challengeRepo;
        this.progressRepo     = progressRepo;
    }

    /** 1) List all challenges */
    @GetMapping
    public ResponseEntity<List<Challenge>> getAllChallenges() {
        return ResponseEntity.ok(challengeService.getAllChallenges());
    }

    /** 2) Get progress entries for a specific user */
    @GetMapping("/progress/{userId}")
    public ResponseEntity<List<UserChallengeProgress>> getProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(challengeService.getProgressForUser(userId));
    }

    /** 3) Create a new challenge (hard-coded userId=1) */
    @PostMapping
    public ResponseEntity<Challenge> create(@RequestBody Challenge challenge) {
        Challenge saved = challengeService.createChallenge(1L, challenge);
        return ResponseEntity.ok(saved);
    }

    /** 4) Update challenge metadata */
    @PutMapping("/{id}")
    public ResponseEntity<Challenge> update(@PathVariable Long id,
                                            @RequestBody Challenge updated) {
        return challengeRepo.findById(id)
            .map(existing -> {
                existing.setTitle(updated.getTitle());
                existing.setDescription(updated.getDescription());
                existing.setType(updated.getType());
                existing.setTargetValue(updated.getTargetValue());
                existing.setTargetMinutes(updated.getTargetMinutes());
                existing.setStartDate(updated.getStartDate());
                existing.setEndDate(updated.getEndDate());
                Challenge saved = challengeRepo.save(existing);
                return ResponseEntity.ok(saved);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** 5) Delete challenge + its progress rows */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        challengeService.deleteChallengeAndProgress(id);
        return ResponseEntity.ok().build();
    }
}