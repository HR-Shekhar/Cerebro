// src/main/java/com/cerebro/service/AiConversationService.java
package com.cerebro.service;

import com.cerebro.model.AiConversation;
import com.cerebro.repository.AiConversationRepository;
import org.springframework.stereotype.Service;

@Service
public class AiConversationService {

    private final AiConversationRepository repo;

    public AiConversationService(AiConversationRepository repo) {
        this.repo = repo;
    }

    /**
     * Persist a new AI conversation (prompt + answer).
     */
    public AiConversation save(String prompt, String answer) {
        AiConversation conv = new AiConversation();
        conv.setPrompt(prompt);
        conv.setAnswer(answer);
        return repo.save(conv);
    }
}