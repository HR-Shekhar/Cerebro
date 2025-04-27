package com.cerebro.service;

import com.cerebro.model.Flashcard;
import com.cerebro.repository.FlashcardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlashcardService {

    private final FlashcardRepository repository;

    public FlashcardService(FlashcardRepository repository) {
        this.repository = repository;
    }

    public Flashcard createFlashcard(Flashcard flashcard) {
        return repository.save(flashcard);
    }

    public List<Flashcard> getAllFlashcards() {
        return repository.findAll();
    }

    public Optional<Flashcard> getFlashcardById(Long id) {
        return repository.findById(id);
    }

    public Flashcard updateFlashcard(Long id, Flashcard updatedCard) {
        return repository.findById(id).map(card -> {
            card.setQuestion(updatedCard.getQuestion());
            card.setAnswer(updatedCard.getAnswer());
            card.setTopic(updatedCard.getTopic());
            card.setDifficulty(updatedCard.getDifficulty());
            card.setBookmarked(updatedCard.getBookmarked());
            card.setMastered(updatedCard.getMastered());
            return repository.save(card);
        }).orElse(null);
    }

    public void deleteFlashcard(Long id) {
        repository.deleteById(id);
    }

    public List<Flashcard> getFlashcardsByTopic(String topic) {
        return repository.findByTopic(topic);
    }

    public List<Flashcard> getBookmarkedFlashcards() {
        return repository.findByBookmarkedTrue();
    }

    public List<Flashcard> getUnmasteredFlashcards() {
        return repository.findByMasteredFalse();
    }
}
