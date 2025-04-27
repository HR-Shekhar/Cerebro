package com.cerebro.controller;

import com.cerebro.model.Flashcard;
import com.cerebro.service.FlashcardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    private final FlashcardService service;

    public FlashcardController(FlashcardService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Flashcard> create(@RequestBody Flashcard flashcard) {
        return ResponseEntity.ok(service.createFlashcard(flashcard));
    }

    @GetMapping
    public ResponseEntity<List<Flashcard>> getAll() {
        return ResponseEntity.ok(service.getAllFlashcards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Flashcard> getById(@PathVariable Long id) {
        return service.getFlashcardById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Flashcard> update(@PathVariable Long id, @RequestBody Flashcard flashcard) {
        Flashcard updated = service.updateFlashcard(id, flashcard);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteFlashcard(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/topic/{topic}")
    public ResponseEntity<List<Flashcard>> byTopic(@PathVariable String topic) {
        return ResponseEntity.ok(service.getFlashcardsByTopic(topic));
    }

    @GetMapping("/bookmarked")
    public ResponseEntity<List<Flashcard>> bookmarked() {
        return ResponseEntity.ok(service.getBookmarkedFlashcards());
    }

    @GetMapping("/unmastered")
    public ResponseEntity<List<Flashcard>> unmastered() {
        return ResponseEntity.ok(service.getUnmasteredFlashcards());
    }
}
