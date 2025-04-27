// src/main/java/com/cerebro/dto/DailyStudySummary.java
package com.cerebro.dto;

import java.time.LocalDate;

public class DailyStudySummary {
    private LocalDate date;
    private Long totalStudyTime;    // renamed from totalMinutes

    public DailyStudySummary(LocalDate date, Long totalStudyTime) {
        this.date = date;
        this.totalStudyTime = totalStudyTime;
    }

    public LocalDate getDate() {
        return date;
    }

    public Long getTotalStudyTime() {
        return totalStudyTime;
    }
}