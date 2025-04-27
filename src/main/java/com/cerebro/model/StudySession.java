package com.cerebro.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.Duration;
import java.time.LocalDateTime;

@Entity
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Jackson will read/write strings like "2025-04-26T14:30:00"
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;

    private Long durationInMinutes;

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonIgnoreProperties({"topics", "studySessions"})
    private Course course;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    @JsonIgnoreProperties({"studySessions", "course"})
    private Topic topic;

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
        // Recalculate duration whenever endTime is set
        if (this.startTime != null && endTime != null) {
            this.durationInMinutes =
                Duration.between(this.startTime, endTime).toMinutes();
        }
    }

    public Long getDurationInMinutes() {
        return durationInMinutes;
    }
    public void setDurationInMinutes(Long durationInMinutes) {
        this.durationInMinutes = durationInMinutes;
    }

    public Course getCourse() {
        return course;
    }
    public void setCourse(Course course) {
        this.course = course;
    }

    public Topic getTopic() {
        return topic;
    }
    public void setTopic(Topic topic) {
        this.topic = topic;
    }
}