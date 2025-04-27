// src/main/java/com/cerebro/controller/AiConversationController.java
package com.cerebro.controller;

import com.cerebro.dto.AiSaveRequest;
import com.cerebro.model.AiConversation;
import com.cerebro.repository.AiConversationRepository;
import com.cerebro.service.AiConversationService;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/conversations")
@CrossOrigin(origins = "http://localhost:5173")
public class AiConversationController {

    private final AiConversationService service;
    private final AiConversationRepository repo;

    public AiConversationController(
        AiConversationService service,
        AiConversationRepository repo) {
        this.service = service;
        this.repo    = repo;
    }

    /**
     * POST /api/ai/conversations
     * Request body: { prompt: "...", answer: "..." }
     * Returns saved AiConversation with ID + timestamp.
     */
    @PostMapping
    public ResponseEntity<AiConversation> save(@RequestBody AiSaveRequest body) {
        AiConversation saved = service.save(body.getPrompt(), body.getAnswer());
        return ResponseEntity.ok(saved);
    }

        @GetMapping
        public List<AiConversation> listAll() {
        // return most recent first
        return repo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}