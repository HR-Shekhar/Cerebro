package com.cerebro.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@Entity
public class UserChallengeProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id")
    @JsonIgnoreProperties("progressEntries")
    private Challenge challenge;

    private int currentValue;
    private boolean completed;
    private LocalDate lastUpdated;
}