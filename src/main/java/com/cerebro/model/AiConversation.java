// src/main/java/com/cerebro/model/AiConversation.java
package com.cerebro.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class AiConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String prompt;

    @Lob
    private String answer;

    private LocalDateTime createdAt = LocalDateTime.now();

    // ─── Getters & Setters ────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public String getPrompt() {
        return prompt;
    }
    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getAnswer() {
        return answer;
    }
    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}