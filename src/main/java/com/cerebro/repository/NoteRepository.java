package com.cerebro.repository;

// src/main/java/com/cerebro/repository/NoteRepository.java


import com.cerebro.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByTitleContainingIgnoreCase(String keyword);
}
