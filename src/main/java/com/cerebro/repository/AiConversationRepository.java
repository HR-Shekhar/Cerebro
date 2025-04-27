// src/main/java/com/cerebro/repository/AiConversationRepository.java
package com.cerebro.repository;

import com.cerebro.model.AiConversation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiConversationRepository
        extends JpaRepository<AiConversation, Long> {
}