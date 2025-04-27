// src/main/java/com/cerebro/model/Course.java
package com.cerebro.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // Prevent serializing back-reference from Topic.course → Course.topics
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("course")
    private List<Topic> topics;

    // Prevent serializing back-reference from StudySession.course → Course.studySessions
    @OneToMany(mappedBy = "course")
    @JsonIgnoreProperties("course")
    private List<StudySession> studySessions;

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Topic> getTopics() {
        return topics;
    }

    public void setTopics(List<Topic> topics) {
        this.topics = topics;
    }

    public List<StudySession> getStudySessions() {
        return studySessions;
    }

    public void setStudySessions(List<StudySession> studySessions) {
        this.studySessions = studySessions;
    }
}