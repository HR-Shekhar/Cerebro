package com.cerebro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question;

    private String answer;

    private String topic;

    private String difficulty; // e.g., EASY, MEDIUM, HARD

    private Boolean bookmarked;

    private Boolean mastered; // has user marked it as "learned"
}

