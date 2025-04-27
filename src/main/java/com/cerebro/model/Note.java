package com.cerebro.model;
// src/main/java/com/cerebro/model/Note.java
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Data
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}


    

