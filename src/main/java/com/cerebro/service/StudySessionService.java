package com.cerebro.service;

import com.cerebro.dto.DailyStudySummary;
import com.cerebro.model.StudySession;
import com.cerebro.repository.StudySessionRepository;
import com.cerebro.repository.TopicRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class StudySessionService {

    private static final Logger log = LoggerFactory.getLogger(StudySessionService.class);
    private static final long DUMMY_USER_ID = 1L;

    private final StudySessionRepository repo;
    private final ChallengeService challengeService;
    private final TopicRepository topicRepository;

    public StudySessionService(
            StudySessionRepository repo,
            ChallengeService challengeService,
            TopicRepository topicRepository
    ) {
        this.repo = repo;
        this.challengeService = challengeService;
        this.topicRepository = topicRepository;
    }

    public StudySession createSession(StudySession session) {
        if (session.getStartTime() != null && session.getEndTime() != null) {
            session.setDurationInMinutes(
                Duration.between(session.getStartTime(), session.getEndTime())
                        .toMinutes()
            );
        }
        StudySession saved = repo.save(session);

        if (saved.getDurationInMinutes() != null) {
            challengeService.updateProgressFromSession(saved.getDurationInMinutes(), DUMMY_USER_ID);
        }

        return saved;
    }

    public List<StudySession> getAllSessions() {
        return repo.findAll();
    }

    public StudySession getSession(Long id) {
        return repo.findById(id).orElse(null);
    }

    public void deleteSession(Long id) {
        repo.deleteById(id);
    }

    public List<DailyStudySummary> getDailySummary() {
        var raw = repo.getRawDailySummary();
        List<DailyStudySummary> out = new ArrayList<>();
        for (Object[] row : raw) {
            if (row[0] != null && row[1] != null) {
                LocalDate date = ((Date) row[0]).toLocalDate();
                long total = ((Number) row[1]).longValue();
                if (total > 0) {
                    out.add(new DailyStudySummary(date, total));
                }
            }
        }
        return out;
    }

    public Map<String, Integer> getWeeklySummary() {
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        LocalDate monday = today.with(DayOfWeek.MONDAY);

        Map<DayOfWeek, Integer> temp = new LinkedHashMap<>();
        for (DayOfWeek d : DayOfWeek.values()) {
            temp.put(d, 0);
        }

        LocalDateTime weekStart = monday.atStartOfDay();
        Instant weekStartInstant = weekStart.atZone(ZoneId.systemDefault()).toInstant();
        List<StudySession> sessions = repo.findAll().stream()
            .filter(s -> s.getStartTime() != null && !s.getStartTime().isBefore(weekStartInstant))
            .toList();

        for (StudySession s : sessions) {
            DayOfWeek dow = s.getStartTime().atZone(ZoneId.systemDefault()).getDayOfWeek();
            temp.put(dow, temp.get(dow) + s.getDurationInMinutes().intValue());
        }

        Map<String, Integer> result = new LinkedHashMap<>();
        for (DayOfWeek d : DayOfWeek.values()) {
            result.put(d.name(), temp.get(d));
        }
        return result;
    }

    public int getCurrentStreak() {
        List<java.sql.Date> rawDates =
            repo.findDistinctStudyDatesOrderedDesc();
        List<LocalDate> studyDates = rawDates.stream()
            .map(Date::toLocalDate)
            .toList();

        log.info("📆 Distinct study dates (desc): {}", studyDates);

        if (studyDates.isEmpty()) {
            log.info("🌵 No study dates, streak = 0");
            return 0;
        }

        int streak = 0;
        LocalDate today = LocalDate.now();
        while (streak < studyDates.size() &&
               studyDates.get(streak).equals(today.minusDays(streak))) {
            streak++;
        }

        log.info("🔥 Calculated streak = {} days", streak);

        challengeService.updateProgressFromStreak(streak, DUMMY_USER_ID);

        return streak;
    }

    public List<StudySession> getSessionsByCourseId(Long courseId) {
        return repo.findByCourseId(courseId);
    }

    public List<StudySession> getSessionsByTopicId(Long topicId) {
        return repo.findByTopicId(topicId);
    }

    public long getTotalMinutesByCourseId(Long courseId) {
        return getSessionsByCourseId(courseId).stream()
                    .mapToLong(StudySession::getDurationInMinutes)
                    .sum();
    }

    public long getTotalMinutesByTopicId(Long topicId) {
        return getSessionsByTopicId(topicId).stream()
                    .mapToLong(StudySession::getDurationInMinutes)
                    .sum();
    }

    /** New method to get course completion percentage */
    public double getCourseCompletion(Long courseId) {
        long totalTopics = topicRepository.countByCourseId(courseId);
        long completedTopics = topicRepository.countByCourseIdAndCompletedTrue(courseId);
    
        if (totalTopics == 0) {
            return 0.0;
        }
        return (double) completedTopics / totalTopics;
    }
}
