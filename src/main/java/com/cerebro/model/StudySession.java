package com.cerebro.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.Duration;
import java.time.Instant;

@Entity
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant startTime;
    private Instant endTime;

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

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
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
