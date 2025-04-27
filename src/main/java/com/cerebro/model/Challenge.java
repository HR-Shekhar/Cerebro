package com.cerebro.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Challenge {

    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String title;
private String description;

@Enumerated(EnumType.STRING)
@Column(name = "type")
private ChallengeType type;

private int targetValue;
private LocalDate startDate;
private LocalDate endDate;

@Column(name="target_hours")
private Integer targetMinutes;

@OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonIgnoreProperties("challenge") // or use @JsonManagedReference/@JsonBackReference
private List<UserChallengeProgress> progressEntries;

// Getters and Setters
public Long getId() {
    return id;
}

public String getTitle() {
    return title;
}
public void setTitle(String title) {
    this.title = title;
}

public String getDescription() {
    return description;
}
public void setDescription(String description) {
    this.description = description;
}

public ChallengeType getType() {
    return type;
}
public void setType(ChallengeType type) {
    this.type = type;
}

public int getTargetValue() {
    return targetValue;
}
public void setTargetValue(int targetValue) {
    this.targetValue = targetValue;
}

public LocalDate getStartDate() {
    return startDate;
}
public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
}

public LocalDate getEndDate() {
    return endDate;
}
public void setEndDate(LocalDate endDate) {
    this.endDate = endDate;
}

public Integer getTargetMinutes() {
    return targetMinutes;
}
public void setTargetMinutes(Integer targetMinutes) {
    this.targetMinutes = targetMinutes;
}

public List<UserChallengeProgress> getProgressEntries() {
    return progressEntries;
}
public void setProgressEntries(List<UserChallengeProgress> progressEntries) {
    this.progressEntries = progressEntries;
}
}
