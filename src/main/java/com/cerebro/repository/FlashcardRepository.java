package com.cerebro.repository;

import com.cerebro.model.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByTopic(String topic);
    List<Flashcard> findByBookmarkedTrue();
    List<Flashcard> findByMasteredFalse();
}
